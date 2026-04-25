package com.example.cms.service;

import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.util.XMLHelper;
import org.apache.poi.xssf.eventusermodel.ReadOnlySharedStringsTable;
import org.apache.poi.xssf.eventusermodel.XSSFReader;
import org.apache.poi.xssf.eventusermodel.XSSFSheetXMLHandler;
import org.apache.poi.xssf.model.StylesTable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.xml.sax.ContentHandler;
import org.xml.sax.InputSource;
import org.xml.sax.XMLReader;

import java.io.File;
import java.io.InputStream;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import com.example.cms.dto.UploadProgress;

@Service
public class BulkCustomerService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final Map<String, UploadProgress> jobStatuses = new ConcurrentHashMap<>();

    public UploadProgress getJobStatus(String jobId) {
        return jobStatuses.get(jobId);
    }

    @org.springframework.scheduling.annotation.Async
    public void processBulkExcelUpload(File tempFile, String jobId) {
        jobStatuses.put(jobId, new UploadProgress("PROCESSING", 0));
        try {
            // Disable POI zip bomb protection for extremely large files
            org.apache.poi.openxml4j.util.ZipSecureFile.setMinInflateRatio(0);

            try (OPCPackage pkg = OPCPackage.open(tempFile, org.apache.poi.openxml4j.opc.PackageAccess.READ)) {

                // Initialize the SAX reader for the massive Excel file
                XSSFReader xssfReader = new XSSFReader(pkg);
                StylesTable styles = xssfReader.getStylesTable();
                ReadOnlySharedStringsTable strings = new ReadOnlySharedStringsTable(pkg);

                // Initialize our custom row handler with a callback to update progress
                CustomerSheetHandler sheetHandler = new CustomerSheetHandler(jdbcTemplate, (count) -> {
                    UploadProgress progress = jobStatuses.get(jobId);
                    if (progress != null) {
                        progress.setProcessedRows(progress.getProcessedRows() + count);
                    }
                });

                // Set up the XML parser to use the handler
                XMLReader parser = XMLHelper.newXMLReader();
                ContentHandler handler = new XSSFSheetXMLHandler(styles, strings, sheetHandler, false);
                parser.setContentHandler(handler);

                // Read the first sheet
                try (InputStream sheet = xssfReader.getSheetsData().next()) {
                    InputSource sheetSource = new InputSource(sheet);
                    parser.parse(sheetSource);
                }

                // Insert any leftover records that didn't reach the 5,000 threshold
                sheetHandler.flushRemaining();
            }
            
            jobStatuses.get(jobId).setStatus("COMPLETED");

        } catch (Exception e) {
            UploadProgress progress = jobStatuses.get(jobId);
            if (progress != null) {
                progress.setStatus("FAILED");
                progress.setErrorMessage(e.getMessage());
            }
            throw new RuntimeException("Failed to process Excel file", e);
        } finally {
            // Always clean up the temporary file
            if (tempFile != null && tempFile.exists()) {
                tempFile.delete();
            }
        }
    }
}
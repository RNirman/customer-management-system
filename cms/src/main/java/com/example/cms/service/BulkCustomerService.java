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
import org.springframework.web.multipart.MultipartFile;
import org.xml.sax.ContentHandler;
import org.xml.sax.InputSource;
import org.xml.sax.XMLReader;

import java.io.InputStream;

@Service
public class BulkCustomerService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Transactional
    public void processBulkExcelUpload(MultipartFile file) {
        try (InputStream inputStream = file.getInputStream();
             OPCPackage pkg = OPCPackage.open(inputStream)) {

            // 1. Initialize the SAX reader for the massive Excel file
            XSSFReader xssfReader = new XSSFReader(pkg);
            StylesTable styles = xssfReader.getStylesTable();
            ReadOnlySharedStringsTable strings = new ReadOnlySharedStringsTable(pkg);

            // 2. Initialize our custom row handler
            CustomerSheetHandler sheetHandler = new CustomerSheetHandler(jdbcTemplate);

            // 3. Set up the XML parser to use our handler
            XMLReader parser = XMLHelper.newXMLReader();
            ContentHandler handler = new XSSFSheetXMLHandler(styles, strings, sheetHandler, false);
            parser.setContentHandler(handler);

            // 4. Read the first sheet (assuming data is on Sheet 1)
            try (InputStream sheet = xssfReader.getSheetsData().next()) {
                InputSource sheetSource = new InputSource(sheet);
                parser.parse(sheetSource);
            }

            // 5. Insert any leftover records that didn't reach the 5,000 threshold
            sheetHandler.flushRemaining();

        } catch (Exception e) {
            throw new RuntimeException("Failed to process Excel file", e);
        }
    }
}
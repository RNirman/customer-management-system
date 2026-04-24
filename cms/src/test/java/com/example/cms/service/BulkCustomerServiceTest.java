package com.example.cms.service;

import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mock.web.MockMultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class BulkCustomerServiceTest {

    // 1. Create a "fake" database connection
    @Mock
    private JdbcTemplate jdbcTemplate;

    // 2. Inject the fake database into our real service
    @InjectMocks
    private BulkCustomerService bulkCustomerService;

    @Test
    void testProcessBulkExcelUpload() throws IOException {

        // 3. Generate a tiny Excel file in memory (RAM)
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            XSSFSheet sheet = workbook.createSheet("Customers");

            // Header Row
            XSSFRow header = sheet.createRow(0);
            header.createCell(0).setCellValue("Name");
            header.createCell(1).setCellValue("DOB");
            header.createCell(2).setCellValue("NIC");

            // Data Row 1
            XSSFRow row1 = sheet.createRow(1);
            row1.createCell(0).setCellValue("John Doe");
            row1.createCell(1).setCellValue("1990-01-01");
            row1.createCell(2).setCellValue("123456789V");

            // Data Row 2
            XSSFRow row2 = sheet.createRow(2);
            row2.createCell(0).setCellValue("Jane Smith");
            row2.createCell(1).setCellValue("1995-05-15");
            row2.createCell(2).setCellValue("987654321V");

            workbook.write(out);
        }

        // 4. Wrap the raw bytes into a Spring MockMultipartFile
        MockMultipartFile mockFile = new MockMultipartFile(
                "file",
                "test-customers.xlsx",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                out.toByteArray()
        );

        // 5. Execute our SAX Parser service logic
        bulkCustomerService.processBulkExcelUpload(mockFile);

        // 6. Verification & Assertions
        // We capture the exact batch of data the service attempted to send to the database
        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<Object[]>> batchArgsCaptor = ArgumentCaptor.forClass(List.class);

        // Verify batchUpdate was called exactly 1 time
        verify(jdbcTemplate, times(1)).batchUpdate(anyString(), batchArgsCaptor.capture());

        List<Object[]> capturedArgs = batchArgsCaptor.getValue();

        // Assert that the parser successfully ignored the header and grabbed our 2 rows
        assertEquals(2, capturedArgs.size(), "Should have parsed exactly 2 data rows");

        // Assert that the actual data was mapped correctly based on columns
        assertEquals("John Doe", capturedArgs.get(0)[0]); // Name
        assertEquals("1990-01-01", capturedArgs.get(0)[1]); // DOB
        assertEquals("123456789V", capturedArgs.get(0)[2]); // NIC
    }
}
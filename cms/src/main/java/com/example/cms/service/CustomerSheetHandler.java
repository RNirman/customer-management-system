package com.example.cms.service;

import org.apache.poi.xssf.eventusermodel.XSSFSheetXMLHandler.SheetContentsHandler;
import org.apache.poi.xssf.usermodel.XSSFComment;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.ArrayList;
import java.util.List;

public class CustomerSheetHandler implements SheetContentsHandler {

    private final JdbcTemplate jdbcTemplate;
    private final List<Object[]> batchArgs = new ArrayList<>();
    private static final int BATCH_SIZE = 5000;

    // Temporary variables to hold current row data
    private String currentName;
    private String currentDob;
    private String currentNic;
    private boolean isHeaderRow = true;

    public CustomerSheetHandler(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void startRow(int rowNum) {
        // Reset variables at the start of each row
        currentName = null;
        currentDob = null;
        currentNic = null;
        if (rowNum > 0) {
            isHeaderRow = false;
        }
    }

    @Override
    public void endRow(int rowNum) {
        if (isHeaderRow) return;

        // Add the extracted row data to our batch list
        // Assuming columns: A = Name, B = DOB, C = NIC
        batchArgs.add(new Object[]{currentName, currentDob, currentNic});

        // If batch is full, execute the insert and clear the list to save memory
        if (batchArgs.size() >= BATCH_SIZE) {
            executeBatchInsert();
        }
    }

    @Override
    public void cell(String cellReference, String formattedValue, XSSFComment comment) {
        if (isHeaderRow) return;

        // Check which column this cell belongs to (A, B, or C)
        if (cellReference.startsWith("A")) {
            currentName = formattedValue;
        } else if (cellReference.startsWith("B")) {
            currentDob = formattedValue;
        } else if (cellReference.startsWith("C")) {
            currentNic = formattedValue;
        }
    }

    @Override
    public void headerFooter(String text, boolean isHeader, String tagName) {
        // Not needed for this assignment
    }

    // Method to execute the remaining batch when the file ends
    public void flushRemaining() {
        if (!batchArgs.isEmpty()) {
            executeBatchInsert();
        }
    }

    private void executeBatchInsert() {
        String sql = "INSERT INTO customer (name, dob, nic) VALUES (?, ?, ?)";

        // Wrap batchArgs in a new ArrayList to pass a copy, protecting it from the immediate .clear()
        jdbcTemplate.batchUpdate(sql, new java.util.ArrayList<>(batchArgs));

        batchArgs.clear(); // Free up memory immediately
    }
}

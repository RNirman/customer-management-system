package com.example.cms.service;

import org.apache.poi.xssf.eventusermodel.XSSFSheetXMLHandler.SheetContentsHandler;
import org.apache.poi.xssf.usermodel.XSSFComment;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;

public class CustomerSheetHandler implements SheetContentsHandler {

    private final JdbcTemplate jdbcTemplate;
    private final List<Object[]> batchArgs = new ArrayList<>();
    private static final int BATCH_SIZE = 5000;

    private String currentName;
    private String currentDob;
    private String currentNic;
    private boolean isHeaderRow = true;
    private final Consumer<Integer> progressCallback;

    public CustomerSheetHandler(JdbcTemplate jdbcTemplate, Consumer<Integer> progressCallback) {
        this.jdbcTemplate = jdbcTemplate;
        this.progressCallback = progressCallback;
    }

    @Override
    public void startRow(int rowNum) {
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

        if (currentName == null || currentName.trim().isEmpty()) {
            return;
        }

        batchArgs.add(new Object[]{currentName, currentDob, currentNic});

        // If batch is full, execute the insert and clear the list to save memory
        if (batchArgs.size() >= BATCH_SIZE) {
            executeBatchInsert();
        }
    }

    @Override
    public void cell(String cellReference, String formattedValue, XSSFComment comment) {
        if (isHeaderRow) return;

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
        
    }

    public void flushRemaining() {
        if (!batchArgs.isEmpty()) {
            executeBatchInsert();
        }
    }

    private void executeBatchInsert() {
        String sql = "INSERT INTO customer (name, dob, nic) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name), dob=VALUES(dob)";

        jdbcTemplate.batchUpdate(sql, new java.util.ArrayList<>(batchArgs));
        int count = batchArgs.size();
        batchArgs.clear();
        
        if (progressCallback != null) {
            progressCallback.accept(count);
        }
    }
}

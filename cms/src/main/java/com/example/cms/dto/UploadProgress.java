package com.example.cms.dto;

public class UploadProgress {
    private String status;
    private int processedRows;
    private String errorMessage;

    public UploadProgress(String status, int processedRows) {
        this.status = status;
        this.processedRows = processedRows;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getProcessedRows() {
        return processedRows;
    }

    public void setProcessedRows(int processedRows) {
        this.processedRows = processedRows;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }
}

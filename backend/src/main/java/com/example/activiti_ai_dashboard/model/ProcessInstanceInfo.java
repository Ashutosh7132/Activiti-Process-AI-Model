package com.example.activiti_ai_dashboard.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProcessInstanceInfo {
    private String id;
    private String definitionId;
    private String definitionKey;
    private String businessKey;
    private Date startTime;
    private String status;
}

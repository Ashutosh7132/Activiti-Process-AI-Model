package com.example.activiti_ai_dashboard.controller;

import com.example.activiti_ai_dashboard.model.ProcessInstanceInfo;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.repository.Deployment;
import org.activiti.engine.runtime.ProcessInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class ProcessController {

    @Autowired
    private RepositoryService repositoryService;

    @Autowired
    private RuntimeService runtimeService;

    // Matches: GET http://localhost:8080/api/processes/instances
    @GetMapping("/api/processes/instances")
    public List<ProcessInstanceInfo> getInstances() {
        return runtimeService.createProcessInstanceQuery()
                .list()
                .stream()
                .map(instance -> new ProcessInstanceInfo(
                        instance.getId(),
                        instance.getProcessDefinitionId(),
                        instance.getProcessDefinitionKey(),
                        instance.getBusinessKey(),
                        instance.getStartTime(),
                        instance.isSuspended() ? "Suspended" : "Active"
                ))
                .collect(Collectors.toList());
    }

    // Matches: POST http://localhost:8080/api/processes/deploy
    @PostMapping("/api/processes/deploy")
    public String deployProcess(@RequestBody String bpmnXml, @RequestParam String name) {
        try {
            Deployment deployment = repositoryService.createDeployment()
                    .addString(name + ".bpmn20.xml", bpmnXml)
                    .name(name)
                    .deploy();
            return deployment.getId();
        } catch (Exception e) {
            return "DEPLOY_ERROR: " + e.getMessage();
        }
    }

    // Matches: POST http://localhost:8080/api/processes/start/{key}
    @PostMapping("/api/processes/start/{processDefinitionKey}")
    public String startProcess(@PathVariable String processDefinitionKey) {
        try {
            ProcessInstance instance = runtimeService.startProcessInstanceByKey(processDefinitionKey);
            return instance.getId();
        } catch (Exception e) {
            return "START_ERROR: " + e.getMessage();
        }
    }

    // Matches: POST http://localhost:8080/api/ai/generate
    @PostMapping("/api/ai/generate")
    public String generateAiProcess(@RequestBody Map<String, String> request) {
        String userPrompt = request.get("prompt");

        // FIXED: Removed backticks and fixed string concatenation for valid Java syntax
        return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
                "<bpmn:definitions xmlns:bpmn=\"http://www.omg.org/spec/BPMN/20100524/MODEL\" \n" +
                "  xmlns:bpmndi=\"http://www.omg.org/spec/BPMN/20100524/DI\" \n" +
                "  xmlns:dc=\"http://www.omg.org/spec/DD/20100524/DC\" \n" +
                "  xmlns:di=\"http://www.omg.org/spec/DD/20100524/DI\" \n" +
                "  targetNamespace=\"http://activiti.org/bpmn\" id=\"Definitions_1\">\n" +
                "  <bpmn:process id=\"Process_AI\" name=\"AI Generated Process\" isExecutable=\"true\">\n" +
                "    <bpmn:startEvent id=\"StartEvent_1\"><bpmn:outgoing>Flow_1</bpmn:outgoing></bpmn:startEvent>\n" +
                "    <bpmn:userTask id=\"Activity_1\" name=\"AI Task: " + userPrompt + "\">\n" +
                "      <bpmn:incoming>Flow_1</bpmn:incoming><bpmn:outgoing>Flow_2</bpmn:outgoing>\n" +
                "    </bpmn:userTask>\n" +
                "    <bpmn:endEvent id=\"Event_1\"><bpmn:incoming>Flow_2</bpmn:incoming></bpmn:endEvent>\n" +
                "    <bpmn:sequenceFlow id=\"Flow_1\" sourceRef=\"StartEvent_1\" targetRef=\"Activity_1\" />\n" +
                "    <bpmn:sequenceFlow id=\"Flow_2\" sourceRef=\"Activity_1\" targetRef=\"Event_1\" />\n" +
                "  </bpmn:process>\n" +
                "  <bpmndi:BPMNDiagram id=\"BPMNDiagram_1\">\n" +
                "    <bpmndi:BPMNPlane id=\"BPMNPlane_1\" bpmnElement=\"Process_AI\">\n" +
                "      <bpmndi:BPMNShape id=\"S_di\" bpmnElement=\"StartEvent_1\"><dc:Bounds x=\"150\" y=\"100\" width=\"36\" height=\"36\" /></bpmndi:BPMNShape>\n" +
                "      <bpmndi:BPMNShape id=\"T_di\" bpmnElement=\"Activity_1\"><dc:Bounds x=\"240\" y=\"80\" width=\"100\" height=\"80\" /></bpmndi:BPMNShape>\n" +
                "      <bpmndi:BPMNShape id=\"E_di\" bpmnElement=\"Event_1\"><dc:Bounds x=\"400\" y=\"100\" width=\"36\" height=\"36\" /></bpmndi:BPMNShape>\n" +
                "      <bpmndi:BPMNEdge id=\"F1_di\" bpmnElement=\"Flow_1\"><di:waypoint x=\"186\" y=\"118\" /><di:waypoint x=\"240\" y=\"118\" /></bpmndi:BPMNEdge>\n" +
                "      <bpmndi:BPMNEdge id=\"F2_di\" bpmnElement=\"Flow_2\"><di:waypoint x=\"340\" y=\"118\" /><di:waypoint x=\"400\" y=\"118\" /></bpmndi:BPMNEdge>\n" +
                "    </bpmndi:BPMNPlane>\n" +
                "  </bpmndi:BPMNDiagram>\n" +
                "</bpmn:definitions>";
    }
}
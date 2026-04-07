import React, { useEffect, useRef, useState, useCallback } from 'react';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import axios from 'axios';
import { Sparkles, UploadCloud } from 'lucide-react';

const API_BASE = "http://localhost:8080/api/processes";

const BpmnDesigner = () => {
  const containerRef = useRef(null);
  const modelerRef = useRef(null);
  const [prompt, setPrompt] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);

  // Define initialDiagram outside or use useMemo to avoid dependency warnings
  const initialDiagram =
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
    'xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" ' +
    'xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" ' +
    'targetNamespace="http://activiti.org/bpmn" id="Definitions_1">' +
    '<bpmn:process id="Process_1" isExecutable="true">' +
    '<bpmn:startEvent id="StartEvent_1"/>' +
    '</bpmn:process>' +
    '<bpmndi:BPMNDiagram id="BPMNDiagram_1">' +
    '<bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">' +
    '<bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">' +
    '<dc:Bounds x="173" y="102" width="36" height="36" />' +
    '</bpmndi:BPMNShape>' +
    '</bpmndi:BPMNPlane>' +
    '</bpmndi:BPMNDiagram>' +
    '</bpmn:definitions>';

  useEffect(() => {
    if (!containerRef.current) return;

    const modeler = new BpmnModeler({
      container: containerRef.current,
      keyboard: { bindTo: window }
    });

    modelerRef.current = modeler;

    const importInitial = async () => {
      try {
        await modeler.importXML(initialDiagram);
      } catch (err) {
        console.error('Error rendering diagram', err);
      }
    };

    importInitial();
    return () => modeler.destroy();
  }, [initialDiagram]); // Fixed: Added initialDiagram as a dependency

  const handleAiGenerate = async () => {
    if (!prompt) return alert("Please describe your process first!");

    setIsDeploying(true);
    try {
      const response = await axios.post(`http://localhost:8080/api/ai/generate`, { prompt });
      const xml = response.data;
      await modelerRef.current.importXML(xml);
      alert("AI has generated your process!");
    } catch (err) {
      console.error(err);
      alert("AI generation failed. Check if backend is running.");
    } finally {
      setIsDeploying(false);
    }
  };

  // Fixed: handleDeploy is now correctly defined inside the component scope
    const handleDeploy = useCallback(async () => {
      if (!modelerRef.current) return;
      setIsDeploying(true);
      try {
        const { xml } = await modelerRef.current.saveXML();

        // Improved logic to find the Process ID (Key)
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, "text/xml");
        // Search for any 'process' tag regardless of the 'bpmn:' prefix
        const processElement = xmlDoc.querySelector("process") || xmlDoc.querySelector("[*|id]");
        const processKey = processElement ? processElement.getAttribute("id") : "Process_1";

        console.log("Attempting to deploy and start:", processKey);

        // 1. Deploy
        const deployRes = await axios.post(`${API_BASE}/deploy?name=Manual_Process`, xml, {
          headers: { 'Content-Type': 'text/plain' }
        });

        if (deployRes.data.startsWith("DEPLOY_ERROR")) {
          throw new Error(deployRes.data);
        }

        // 2. Start
        const startRes = await axios.post(`${API_BASE}/start/${processKey}`);

        if (startRes.data.startsWith("START_ERROR")) {
          throw new Error(startRes.data);
        }

        alert(`Success!\nInstance ID: ${startRes.data}`);
      } catch (err) {
        console.error("Detailed Error:", err);
        // This will now show the SPECIFIC reason (e.g., "START_ERROR: No process found")
        alert(err.message || "Deployment or Start failed.");
      } finally {
        setIsDeploying(false);
      }
    },[]); // Using useCallback for optimization

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '1rem', background: '#f1f5f9', display: 'flex', gap: '1rem', alignItems: 'center', zIndex: 10 }}>
        <input
          type="text"
          placeholder="Describe your process (e.g., 'A simple leave approval')..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
        />
        <button style={btnStyle('#6366f1')} onClick={handleAiGenerate} disabled={isDeploying}>
          <Sparkles size={18} /> {isDeploying ? 'Thinking...' : 'AI Generate'}
        </button>
        <button onClick={handleDeploy} disabled={isDeploying} style={btnStyle('#22c55e')}>
          <UploadCloud size={18} /> {isDeploying ? 'Deploying...' : 'Deploy to Activiti'}
        </button>
      </div>
      <div
        ref={containerRef}
        style={{ flex: 1, background: 'white', borderTop: '1px solid #e2e8f0', minHeight: '500px' }}
      />
    </div>
  );
};

const btnStyle = (bg) => ({
  background: bg,
  color: 'white',
  border: 'none',
  padding: '0.75rem 1.25rem',
  borderRadius: '8px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontWeight: 'bold'
});

export default BpmnDesigner;
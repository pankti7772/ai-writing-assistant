# 🚀 AI Writing Assistant (Local LLM)

A high-performance React application that runs a Large Language Model (Llama-3) **100% locally** in the browser. By leveraging **WebGPU** via the **WebLLM** runtime, this assistant provides intelligent content generation without the need for external APIs or server-side processing.

---

## 🌟 Key Features

* **Total Privacy:** Your data never leaves your machine. All inference happens locally in the browser.
* **No API Costs:** Skip the OpenAI/Anthropic subscription fees.
* **Tone & Format Control:** Fine-tuned system prompting allows for Formal, Casual, and Persuasive writing styles.
* **Hardware Accelerated:** Optimized for modern GPUs (including Apple M-series silicon) using the WebGPU standard.

## 🛠️ Tech Stack

* **Frontend:** React 18, Vite, TypeScript
* **Styling:** Tailwind CSS (Modern, responsive UI)
* **AI Engine:** [WebLLM](https://www.google.com/search?q=https://webllm.mlc-ai.org/)
* **Model:** Llama-3-8B (Quantized for browser performance)

## 🚀 Getting Started

### Prerequisites

* A browser with **WebGPU** support (Chrome 113+, Edge 113+, or Safari Technology Preview).
* **Node.js** (v18 or higher).

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/pankti7772/ai-writing-assistant.git
cd ai-writing-assistant

```


2. **Install dependencies:**
```bash
npm install

```


3. **Run the development server:**
```bash
npm run dev

```


4. **Initialize the Model:**
Upon first load, the app will download the Llama-3 weights (approx. 4GB) to your browser's local cache. This is a one-time setup.

## 📝 Usage

1. **Input:** Enter your raw notes or a topic in the text area.
2. **Configure:** Use the sidebar to select your desired **Tone**, **Format** (Email, Blog, etc.), and **Target Audience**.
3. **Generate:** Hit "Generate Content" and watch the local LLM stream the response in real-time.

---

## ⚙️ Engineering Highlights

* **System Prompting:** Implemented a dynamic prompt injection layer that translates UI state (dropdowns/toggles) into structured instructions for the LLM.
* **WebGPU Optimization:** Leverages 4-bit quantization to ensure large models run smoothly on consumer hardware with limited VRAM.

---

**Developed by Pankti Singh** *Computer Science & Engineering Student | Data Science Intern*

--
import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import {
  Play,
  FileText,
  MessageSquare,
  Lightbulb,
  Bookmark,
  Share2,
  Clock,
  ChevronRight,
  BookOpen,
  Terminal,
  Code2,
  Users,
  ThumbsUp,
  Home,
  Send,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useProblemStore } from "../store/useProblemStore";
import { getLanguageId } from "../lib/lang";
import { useExecutionStore } from "../store/useExecutionStore";
import { useSubmissionStore } from "../store/useSubmissionStore";
import Submission from "../components/Submission";
import SubmissionsList from "../components/SubmissionList";

const ProblemPage = () => {
  const { id } = useParams();
  const { getProblemById, problem, isProblemLoading } = useProblemStore();

  const {
    submission: submissions,
    isLoading: isSubmissionsLoading,
    getSubmissionForProblem,
    getSubmissionCountForProblem,
    submissionCount,
  } = useSubmissionStore();

  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [testcases, setTestCases] = useState([]);
  const [runResults, setRunResults] = useState(null);

  const { executeCode, runCode, submission, isExecuting } = useExecutionStore();

  useEffect(() => {
    getProblemById(id);
    getSubmissionCountForProblem(id);
  }, [id]);

  // Handle initial problem load and set default language
  useEffect(() => {
    if (problem && problem.codeSnippets) {
      // Get available languages
      const availableLanguages = Object.keys(problem.codeSnippets);
      
      // If current selected language doesn't have a code snippet, use the first available language
      if (!problem.codeSnippets[selectedLanguage] && availableLanguages.length > 0) {
        const firstAvailableLanguage = availableLanguages[0];
        setSelectedLanguage(firstAvailableLanguage);
        setCode(problem.codeSnippets[firstAvailableLanguage] || "");
      } else {
        // Set code for the selected language
        setCode(problem.codeSnippets[selectedLanguage] || submission?.sourceCode || "");
      }
      
      // Set test cases
      setTestCases(
        problem.testcases?.map((tc) => ({
          input: tc.input,
          output: tc.output,
        })) || []
      );
    }
  }, [problem]);

  // Handle language change
  useEffect(() => {
    if (problem && problem.codeSnippets && problem.codeSnippets[selectedLanguage]) {
      setCode(problem.codeSnippets[selectedLanguage]);
    }
  }, [selectedLanguage]);

  useEffect(() => {
    if (activeTab === "submissions" && id) {
      getSubmissionForProblem(id);
    }
  }, [activeTab, id]);

  // Refresh submissions when a new submission is made
  useEffect(() => {
    if (submission && id) {
      // Refresh submissions list
      getSubmissionForProblem(id);
      // Update submission count
      getSubmissionCountForProblem(id);
    }
  }, [submission]);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
  };

  const handleRunCode = async (e) => {
    e.preventDefault();
    setRunResults(null);
    
    try {
      const language_id = getLanguageId(selectedLanguage);
      const stdin = problem.testcases.map((tc) => tc.input);
      const expected_outputs = problem.testcases.map((tc) => tc.output);
      
      const data = await runCode(code, language_id, stdin, expected_outputs);
      setRunResults(data);
    } catch (error) {
      console.error("Error running code:", error);
    }
  };

  const handleSubmitSolution = async (e) => {
    e.preventDefault();
    setRunResults(null);
    
    try {
      const language_id = getLanguageId(selectedLanguage);
      const stdin = problem.testcases.map((tc) => tc.input);
      const expected_outputs = problem.testcases.map((tc) => tc.output);
      await executeCode(code, language_id, stdin, expected_outputs, id);
    } catch (error) {
      console.log("Error submitting solution", error);
    }
  };

  if (isProblemLoading || !problem) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0b0d]">
        <div className="card glass-effect p-8">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-gray-400">Loading problem...</p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="text-gray-300">
            <p className="text-base mb-6 leading-relaxed">{problem.description}</p>

            {problem.examples && (
              <>
                <h3 className="text-lg font-bold mb-4 gradient-text">Examples:</h3>
                {Object.entries(problem.examples).map(
                  ([lang, example], idx) => (
                    <div
                      key={lang}
                      className="glass-effect p-5 rounded-xl mb-4 border border-primary/20"
                    >
                      <div className="mb-3">
                        <div className="text-primary mb-2 text-sm font-semibold">
                          Input:
                        </div>
                        <code className="bg-black/50 px-3 py-1 rounded text-sm text-gray-200">
                          {example.input}
                        </code>
                      </div>
                      <div className="mb-3">
                        <div className="text-primary mb-2 text-sm font-semibold">
                          Output:
                        </div>
                        <code className="bg-black/50 px-3 py-1 rounded text-sm text-gray-200">
                          {example.output}
                        </code>
                      </div>
                      {example.explanation && (
                        <div>
                          <div className="text-primary mb-2 text-sm font-semibold">
                            Explanation:
                          </div>
                          <p className="text-gray-400 text-sm">
                            {example.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                )}
              </>
            )}

            {problem.constraints && (
              <>
                <h3 className="text-lg font-bold mb-4 gradient-text">Constraints:</h3>
                <div className="glass-effect p-5 rounded-xl border border-primary/20">
                  <code className="text-sm text-gray-200">
                    {problem.constraints}
                  </code>
                </div>
              </>
            )}
          </div>
        );
      case "submissions":
        return (
          <SubmissionsList
            submissions={submissions}
            isLoading={isSubmissionsLoading}
          />
        );
      case "discussion":
        return (
          <div className="p-4 text-center text-gray-400">
            No discussions yet
          </div>
        );
      case "hints":
        return (
          <div className="p-4">
            {problem?.hints ? (
              <div className="glass-effect p-5 rounded-xl border border-primary/20">
                <p className="text-gray-300">
                  {problem.hints}
                </p>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                No hints available
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const renderRunResults = () => {
    if (!runResults) return null;

    return (
      <div className="glass-effect rounded-xl mt-6 border border-primary/20">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold gradient-text">Run Results</h3>
            <div className={`badge ${runResults.allPassed ? 'badge-success' : 'badge-error'} badge-lg`}>
              {runResults.passedTests}/{runResults.totalTests} Passed
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="table table-sm w-full">
              <thead>
                <tr className="border-b border-primary/20">
                  <th className="text-gray-400">Test Case</th>
                  <th className="text-gray-400">Status</th>
                  <th className="text-gray-400">Input</th>
                  <th className="text-gray-400">Expected</th>
                  <th className="text-gray-400">Output</th>
                  <th className="text-gray-400">Time</th>
                  <th className="text-gray-400">Memory</th>
                </tr>
              </thead>
              <tbody>
                {runResults.results.map((result, index) => (
                  <tr key={index} className="border-b border-primary/10">
                    <td className="text-gray-300">{result.testCase}</td>
                    <td>
                      <div className={`badge badge-sm ${result.passed ? 'badge-success' : 'badge-error'}`}>
                        {result.passed ? 'PASS' : 'FAIL'}
                      </div>
                    </td>
                    <td className="font-mono text-xs text-gray-300">{testcases[index]?.input}</td>
                    <td className="font-mono text-xs text-gray-300">{result.expected}</td>
                    <td className="font-mono text-xs text-gray-300">{result.stdout || 'No output'}</td>
                    <td className="text-xs text-gray-300">{result.time || '-'}</td>
                    <td className="text-xs text-gray-300">{result.memory || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0b0d]">
      <nav className="navbar glass-effect px-6 border-b border-primary/20">
        <div className="flex-1 gap-2">
          <Link to={"/"} className="btn btn-ghost btn-sm gap-2 text-primary">
            <Home className="w-5 h-5" />
            <span className="text-gray-400">Home</span>
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-500" />
          <div>
            <h1 className="text-xl font-bold text-white">{problem.title}</h1>
            <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(problem.createdAt).toLocaleDateString()}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {submissionCount} Submissions
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ThumbsUp className="w-3 h-3" />
                95% Success
              </span>
            </div>
          </div>
        </div>
        <div className="flex-none gap-3">
          <button
            className={`btn btn-ghost btn-sm btn-circle ${
              isBookmarked ? "text-primary" : "text-gray-400"
            }`}
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            <Bookmark className="w-5 h-5" />
          </button>
          <button className="btn btn-ghost btn-sm btn-circle text-gray-400">
            <Share2 className="w-5 h-5" />
          </button>
          <select
            className="select select-sm glass-effect border-primary/20 text-white"
            value={selectedLanguage}
            onChange={handleLanguageChange}
          >
            {Object.keys(problem.codeSnippets || {}).map((lang) => (
              <option key={lang} value={lang}>
                {lang === 'cpp' ? 'C++' : lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </nav>

      <div className="container mx-auto p-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Panel - Description */}
          <div className="lg:col-span-2 glass-effect rounded-xl overflow-hidden border border-primary/20">
            <div className="tabs tabs-boxed bg-transparent p-2">
              <button
                className={`tab text-xs ${
                  activeTab === "description" 
                    ? "bg-primary text-dark-navy font-semibold" 
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={() => setActiveTab("description")}
              >
                <FileText className="w-4 h-4 mr-1" />
                Description
              </button>
              <button
                className={`tab text-xs ${
                  activeTab === "submissions" 
                    ? "bg-primary text-dark-navy font-semibold" 
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={() => setActiveTab("submissions")}
              >
                <Code2 className="w-4 h-4 mr-1" />
                Submissions
              </button>
              <button
                className={`tab text-xs ${
                  activeTab === "discussion" 
                    ? "bg-primary text-dark-navy font-semibold" 
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={() => setActiveTab("discussion")}
              >
                <MessageSquare className="w-4 h-4 mr-1" />
                Discussion
              </button>
              <button
                className={`tab text-xs ${
                  activeTab === "hints" 
                    ? "bg-primary text-dark-navy font-semibold" 
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={() => setActiveTab("hints")}
              >
                <Lightbulb className="w-4 h-4 mr-1" />
                Hints
              </button>
            </div>

            <div className="p-6 max-h-[calc(100vh-250px)] overflow-y-auto">
              {renderTabContent()}
            </div>
          </div>

          {/* Right Panel - Code Editor */}
          <div className="lg:col-span-3 glass-effect rounded-xl overflow-hidden border border-primary/20">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-4 py-3 border-b border-primary/20">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-primary" />
                <span className="font-semibold text-white">Code Editor</span>
              </div>
            </div>

            <div className="h-[calc(100vh-350px)] min-h-[500px]">
              <Editor
                height="100%"
                language={selectedLanguage.toLowerCase()}
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 16,
                  lineNumbers: "on",
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  readOnly: false,
                  automaticLayout: true,
                  fontFamily: "'Fira Code', 'Courier New', monospace",
                  padding: { top: 16, bottom: 16 },
                }}
              />
            </div>

            <div className="p-4 border-t border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
              <div className="flex justify-between items-center">
                <button
                  className={`btn btn-sm bg-gradient-to-r from-primary to-secondary text-dark-navy border-0 hover-glow font-semibold gap-2 ${
                    isExecuting ? "loading" : ""
                  }`}
                  onClick={handleRunCode}
                  disabled={isExecuting}
                >
                  {!isExecuting && <Play className="w-4 h-4" />}
                  {isExecuting ? "Running..." : "Run Code"}
                </button>
                <button 
                  className={`btn btn-sm bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 hover-glow font-semibold gap-2 ${
                    isExecuting ? "loading" : ""
                  }`}
                  onClick={handleSubmitSolution}
                  disabled={isExecuting}
                >
                  {!isExecuting && <Send className="w-4 h-4" />}
                  {isExecuting ? "Submitting..." : "Submit Solution"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {runResults && renderRunResults()}
        
        {submission && !runResults && (
          <div className="glass-effect rounded-xl mt-6 border border-primary/20">
            <div className="p-6">
              <Submission submission={submission} />
            </div>
          </div>
        )}

        {!submission && !runResults && (
          <div className="glass-effect rounded-xl mt-6 border border-primary/20">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold gradient-text">Test Cases</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="table table-sm w-full">
                  <thead>
                    <tr className="border-b border-primary/20">
                      <th className="text-gray-400">Input</th>
                      <th className="text-gray-400">Expected Output</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testcases.map((testCase, index) => (
                      <tr key={index} className="border-b border-primary/10">
                        <td className="font-mono text-sm text-gray-300">{testCase.input}</td>
                        <td className="font-mono text-sm text-gray-300">{testCase.output}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemPage;
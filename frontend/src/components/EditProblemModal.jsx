import React, { useState, useEffect } from "react";
import { X, Save, Plus, Tag, Building } from "lucide-react";
import toast from "react-hot-toast";

// Common company tags
const COMPANY_SUGGESTIONS = [
  "Google", "Amazon", "Microsoft", "Meta", "Apple", 
  "Netflix", "Adobe", "Uber", "LinkedIn", "Twitter",
  "Oracle", "Goldman Sachs", "JPMorgan", "Bloomberg",
  "Salesforce", "PayPal", "Spotify", "Airbnb", "Tesla"
];

// Common topic tags
const TOPIC_SUGGESTIONS = [
  "Array", "String", "Tree", "Graph", "Dynamic Programming",
  "Binary Search", "Two Pointers", "Sliding Window", "Stack",
  "Queue", "Heap", "Hash Table", "Linked List", "Recursion",
  "Backtracking", "Greedy", "BFS", "DFS", "Sorting", "Math"
];

const EditProblemModal = ({ isOpen, onClose, problem, onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("EASY");
  const [tags, setTags] = useState([]);
  const [companyTags, setCompanyTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [newCompanyTag, setNewCompanyTag] = useState("");
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);

  useEffect(() => {
    if (problem) {
      setTitle(problem.title);
      setDescription(problem.description);
      setDifficulty(problem.difficulty);
      
      // Separate company tags from topic tags
      const companies = problem.tags?.filter(tag => 
        COMPANY_SUGGESTIONS.includes(tag)
      ) || [];
      const topics = problem.tags?.filter(tag => 
        !COMPANY_SUGGESTIONS.includes(tag)
      ) || [];
      
      setCompanyTags(companies);
      setTags(topics);
    }
  }, [problem]);

  const handleAddTag = (tag) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setNewTag("");
      setShowTagSuggestions(false);
    }
  };

  const handleAddCompanyTag = (company) => {
    if (company && !companyTags.includes(company)) {
      setCompanyTags([...companyTags, company]);
      setNewCompanyTag("");
      setShowCompanySuggestions(false);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleRemoveCompanyTag = (companyToRemove) => {
    setCompanyTags(companyTags.filter(company => company !== companyToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const updatedProblem = {
      ...problem,
      title,
      description,
      difficulty,
      tags: [...tags, ...companyTags]
    };

    await onSave(updatedProblem);
    onClose();
  };

  const filteredTopics = TOPIC_SUGGESTIONS.filter(topic =>
    topic.toLowerCase().includes(newTag.toLowerCase()) && !tags.includes(topic)
  );

  const filteredCompanies = COMPANY_SUGGESTIONS.filter(company =>
    company.toLowerCase().includes(newCompanyTag.toLowerCase()) && !companyTags.includes(company)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Edit Problem</h2>
          <button onClick={onClose} className="btn btn-ghost btn-sm">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="textarea textarea-bordered w-full h-32"
                required
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Difficulty</span>
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="select select-bordered w-full"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            {/* Company Tags */}
            <div>
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Company Tags
                </span>
              </label>
              <div className="relative">
                <div className="flex flex-wrap gap-2 mb-2">
                  {companyTags.map((company) => (
                    <span key={company} className="badge badge-primary gap-1">
                      {company}
                      <button
                        type="button"
                        onClick={() => handleRemoveCompanyTag(company)}
                        className="btn btn-ghost btn-xs p-0"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCompanyTag}
                    onChange={(e) => setNewCompanyTag(e.target.value)}
                    onFocus={() => setShowCompanySuggestions(true)}
                    onBlur={() => setTimeout(() => setShowCompanySuggestions(false), 200)}
                    placeholder="Add company tag..."
                    className="input input-bordered input-sm flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddCompanyTag(newCompanyTag)}
                    className="btn btn-primary btn-sm"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {showCompanySuggestions && filteredCompanies.length > 0 && (
                  <div className="absolute top-full mt-1 w-full bg-base-200 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">
                    {filteredCompanies.map((company) => (
                      <button
                        key={company}
                        type="button"
                        onClick={() => handleAddCompanyTag(company)}
                        className="block w-full text-left px-4 py-2 hover:bg-primary/20 transition-colors"
                      >
                        {company}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Topic Tags */}
            <div>
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Topic Tags
                </span>
              </label>
              <div className="relative">
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <span key={tag} className="badge badge-secondary gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="btn btn-ghost btn-xs p-0"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onFocus={() => setShowTagSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowTagSuggestions(false), 200)}
                    placeholder="Add topic tag..."
                    className="input input-bordered input-sm flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTag(newTag)}
                    className="btn btn-secondary btn-sm"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {showTagSuggestions && filteredTopics.length > 0 && (
                  <div className="absolute top-full mt-1 w-full bg-base-200 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">
                    {filteredTopics.map((topic) => (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => handleAddTag(topic)}
                        className="block w-full text-left px-4 py-2 hover:bg-secondary/20 transition-colors"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProblemModal;
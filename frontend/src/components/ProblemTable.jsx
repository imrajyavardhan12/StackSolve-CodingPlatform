import React, { useState, useMemo } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Bookmark, PencilIcon, Trash, TrashIcon, Plus, Search, Filter } from "lucide-react";
import { useActions } from "../store/useAction";
import AddToPlaylistModal from "./AddToPlaylist";
import CreatePlaylistModal from "./CreatePlaylistModal";
import { usePlaylistStore } from "../store/usePlaylistStore";


const ProblemsTable = ({ problems }) => {
  const { authUser } = useAuthStore();
  const { onDeleteProblem } = useActions();
  const { createPlaylist } = usePlaylistStore();
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [selectedTag, setSelectedTag] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState(null);

  // Extract all unique tags from problems
  const allTags = useMemo(() => {
    if (!Array.isArray(problems)) return [];
    const tagsSet = new Set();
    problems.forEach((p) => p.tags?.forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet);
  }, [problems]);

  // Define allowed difficulties
  const difficulties = ["EASY", "MEDIUM", "HARD"];

  // Filter problems based on search, difficulty, and tags
  const filteredProblems = useMemo(() => {
    return (problems || [])
      .filter((problem) =>
        problem.title.toLowerCase().includes(search.toLowerCase())
      )
      .filter((problem) =>
        difficulty === "ALL" ? true : problem.difficulty === difficulty
      )
      .filter((problem) =>
        selectedTag === "ALL" ? true : problem.tags?.includes(selectedTag)
      );
  }, [problems, search, difficulty, selectedTag]);

  // Pagination logic
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const paginatedProblems = useMemo(() => {
    return filteredProblems.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredProblems, currentPage]);

  const handleDelete = (id) => {
    onDeleteProblem(id);
  };

  const handleCreatePlaylist = async (data) => {
    await createPlaylist(data);
  };

  const handleAddToPlaylist = (problemId) => {
    setSelectedProblemId(problemId);
    setIsAddToPlaylistModalOpen(true);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-bold gradient-text mb-2">Problems</h2>
          <p className="text-gray-300">Choose your challenge and start coding</p>
        </div>
        <button
          className="btn bg-gradient-to-r from-primary to-secondary text-dark-navy border-0 hover-glow font-semibold"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Create Playlist
        </button>
      </div>

      <div className="glass-effect rounded-2xl p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="relative col-span-1 md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search problems..."
              className="input input-bordered w-full pl-10 glass-effect border-primary/20 text-white placeholder-gray-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="dropdown">
            <label tabIndex={0} className="btn glass-effect border-primary/20 w-full justify-between text-white">
              <span>{difficulty === "ALL" ? "All Difficulties" : difficulty}</span>
              <Filter className="w-4 h-4" />
            </label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow glass-effect rounded-box w-full mt-1">
              <li><a onClick={() => setDifficulty("ALL")} className="hover:bg-primary/20 text-white">All Difficulties</a></li>
              {difficulties.map((diff) => (
                <li key={diff}>
                  <a onClick={() => setDifficulty(diff)} className="hover:bg-primary/20 text-white">
                    {diff.charAt(0).toUpperCase() + diff.slice(1).toLowerCase()}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="dropdown">
            <label tabIndex={0} className="btn glass-effect border-primary/20 w-full justify-between text-white">
              <span>{selectedTag === "ALL" ? "All Tags" : selectedTag}</span>
              <Filter className="w-4 h-4" />
            </label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow glass-effect rounded-box w-full mt-1 max-h-60 overflow-y-auto">
              <li><a onClick={() => setSelectedTag("ALL")} className="hover:bg-primary/20 text-white">All Tags</a></li>
              {allTags.map((tag) => (
                <li key={tag}>
                  <a onClick={() => setSelectedTag(tag)} className="hover:bg-primary/20 text-white">
                    {tag}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="glass-effect rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-lg w-full">
            <thead className="bg-gradient-to-r from-primary/10 to-secondary/10">
              <tr className="border-b border-primary/20">
                <th className="text-white font-semibold">Status</th>
                <th className="text-white font-semibold">Title</th>
                <th className="text-white font-semibold">Tags</th>
                <th className="text-white font-semibold">Difficulty</th>
                <th className="text-white font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProblems.length > 0 ? (
                paginatedProblems.map((problem) => {
                  const isSolved = problem.solvedBy.some(
                    (user) => user.userId === authUser?.id
                  );
                  return (
                    <tr key={problem.id} className="border-b border-primary/10 hover:bg-primary/5 transition-colors">
                      <td>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSolved}
                            readOnly
                            className="checkbox checkbox-sm checkbox-primary"
                          />
                          {isSolved && <span className="text-success font-semibold">Solved</span>}
                        </div>
                      </td>
                      <td>
                        <Link to={`/problem/${problem.id}`} className="font-semibold text-white hover:text-primary transition-colors">
                          {problem.title}
                        </Link>
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {(problem.tags || []).slice(0, 2).map((tag, idx) => (
                            <span
                              key={idx}
                              className="badge badge-outline border-primary/50 text-primary text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                          {problem.tags && problem.tags.length > 2 && (
                            <span className="badge badge-outline border-gray-500 text-gray-400 text-xs">
                              +{problem.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge font-semibold text-xs ${
                            problem.difficulty === "EASY"
                              ? "badge-success text-white"
                              : problem.difficulty === "MEDIUM"
                              ? "badge-warning text-dark-navy"
                              : "badge-error text-white"
                          }`}
                        >
                          {problem.difficulty}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2 items-center">
                          <button
                            className="btn btn-sm glass-effect border-primary/20 text-primary hover:bg-primary/20"
                            onClick={() => handleAddToPlaylist(problem.id)}
                          >
                            <Bookmark className="w-4 h-4" />
                          </button>
                          
                          {authUser?.role === "ADMIN" && (
                            <>
                              <button
                                onClick={() => handleDelete(problem.id)}
                                className="btn btn-sm btn-error"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                              <button disabled className="btn btn-sm btn-warning">
                                <PencilIcon className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-8">
                    <div className="text-gray-400">
                      <div className="text-2xl mb-2">No problems found</div>
                      <div>Try adjusting your search criteria or filters</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            className="btn glass-effect border-primary/20 text-white hover:bg-primary/20 disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </button>
          
          <div className="flex gap-2">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let page;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={page}
                  className={`btn btn-sm ${
                    currentPage === page
                      ? "bg-primary text-dark-navy border-primary"
                      : "glass-effect border-primary/20 text-white hover:bg-primary/20"
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              );
            })}
          </div>
          
          <button
            className="btn glass-effect border-primary/20 text-white hover:bg-primary/20 disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}

      <CreatePlaylistModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePlaylist}
      />
      
      <AddToPlaylistModal
        isOpen={isAddToPlaylistModalOpen}
        onClose={() => setIsAddToPlaylistModalOpen(false)}
        problemId={selectedProblemId}
      />
    </div>
  );
};

export default ProblemsTable;
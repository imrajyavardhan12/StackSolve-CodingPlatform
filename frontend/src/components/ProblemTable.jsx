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

  const allTags = useMemo(() => {
    if (!Array.isArray(problems)) return [];
    const tagsSet = new Set();
    problems.forEach((p) => p.tags?.forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet);
  }, [problems]);

  const difficulties = ["EASY", "MEDIUM", "HARD"];

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

  const itemsPerPage = 8;
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
    <div className="w-full relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold gradient-text mb-1">Problems</h3>
          <p className="text-gray-400 text-sm">Choose your challenge and start coding</p>
        </div>
        <button
          className="btn btn-sm bg-gradient-to-r from-primary to-secondary text-dark-navy border-0 hover-glow font-semibold"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Create Playlist
        </button>
      </div>

      <div className="glass-effect rounded-xl p-4 mb-6 relative z-30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search problems..."
              className="input input-sm input-bordered w-full pl-10 glass-effect border-primary/20 text-white placeholder-gray-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="dropdown dropdown-bottom dropdown-end">
            <label tabIndex={0} className="btn btn-sm glass-effect border-primary/20 w-full justify-between text-white">
              <span className="text-xs">{difficulty === "ALL" ? "All Difficulties" : difficulty}</span>
              <Filter className="w-3 h-3" />
            </label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow-2xl backdrop-blur-xl bg-[#1A1B23]/95 rounded-box w-48 mt-2 z-[9999] border border-primary/40">
              <li>
                <a 
                  onClick={() => setDifficulty("ALL")} 
                  className="hover:bg-primary/30 text-white text-xs py-2 px-3 rounded-lg transition-all duration-200 hover:text-white font-medium"
                >
                  All Difficulties
                </a>
              </li>
              {difficulties.map((diff) => (
                <li key={diff}>
                  <a 
                    onClick={() => setDifficulty(diff)} 
                    className="hover:bg-primary/30 text-white text-xs py-2 px-3 rounded-lg transition-all duration-200 hover:text-white font-medium"
                  >
                    {diff.charAt(0).toUpperCase() + diff.slice(1).toLowerCase()}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="dropdown dropdown-bottom dropdown-end">
            <label tabIndex={0} className="btn btn-sm glass-effect border-primary/20 w-full justify-between text-white">
              <span className="text-xs">{selectedTag === "ALL" ? "All Tags" : selectedTag}</span>
              <Filter className="w-3 h-3" />
            </label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow-2xl backdrop-blur-xl bg-[#1A1B23]/95 rounded-box w-48 mt-2 max-h-48 overflow-y-auto z-[9999] border border-primary/40">
              <li>
                <a 
                  onClick={() => setSelectedTag("ALL")} 
                  className="hover:bg-primary/30 text-white text-xs py-2 px-3 rounded-lg transition-all duration-200 hover:text-white font-medium"
                >
                  All Tags
                </a>
              </li>
              {allTags.map((tag) => (
                <li key={tag}>
                  <a 
                    onClick={() => setSelectedTag(tag)} 
                    className="hover:bg-primary/30 text-white text-xs py-2 px-3 rounded-lg transition-all duration-200 hover:text-white font-medium"
                  >
                    {tag}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="glass-effect rounded-xl overflow-hidden relative z-10">
        <div className="overflow-x-auto">
          <table className="table table-sm w-full">
            <thead className="bg-gradient-to-r from-primary/10 to-secondary/10">
              <tr className="border-b border-primary/20">
                <th className="text-white font-semibold text-xs">Status</th>
                <th className="text-white font-semibold text-xs">Title</th>
                <th className="text-white font-semibold text-xs">Tags</th>
                <th className="text-white font-semibold text-xs">Difficulty</th>
                <th className="text-white font-semibold text-xs">Actions</th>
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
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSolved}
                            readOnly
                            className="checkbox checkbox-xs checkbox-primary"
                          />
                          {isSolved && <span className="text-success font-semibold text-xs">✓</span>}
                        </div>
                      </td>
                      <td className="py-2">
                        <Link to={`/problem/${problem.id}`} className="font-medium text-white hover:text-primary transition-colors text-sm">
                          {problem.title}
                        </Link>
                      </td>
                      <td className="py-2">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {(problem.tags || []).slice(0, 2).map((tag, idx) => (
                            <span
                              key={idx}
                              className="badge badge-xs badge-outline border-primary/50 text-primary"
                            >
                              {tag}
                            </span>
                          ))}
                          {problem.tags && problem.tags.length > 2 && (
                            <span className="badge badge-xs badge-outline border-gray-500 text-gray-400">
                              +{problem.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2">
                        <span
                          className={`badge badge-xs font-medium ${
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
                      <td className="py-2">
                        <div className="flex gap-1 items-center">
                          <button
                            className="btn btn-xs glass-effect border-primary/20 text-primary hover:bg-primary/20"
                            onClick={() => handleAddToPlaylist(problem.id)}
                          >
                            <Bookmark className="w-3 h-3" />
                          </button>
                          
                          {authUser?.role === "ADMIN" && (
                            <>
                              <button
                                onClick={() => handleDelete(problem.id)}
                                className="btn btn-xs btn-error"
                              >
                                <TrashIcon className="w-3 h-3" />
                              </button>
                              <button disabled className="btn btn-xs btn-warning">
                                <PencilIcon className="w-3 h-3" />
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
                      <div className="text-lg mb-1">No problems found</div>
                      <div className="text-xs">Try adjusting your search criteria or filters</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            className="btn btn-xs glass-effect border-primary/20 text-white hover:bg-primary/20 disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </button>
          
          <div className="flex gap-1">
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
                  className={`btn btn-xs ${
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
            className="btn btn-xs glass-effect border-primary/20 text-white hover:bg-primary/20 disabled:opacity-50"
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
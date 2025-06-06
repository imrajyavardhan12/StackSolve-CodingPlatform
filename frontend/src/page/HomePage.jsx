import React, { useEffect } from "react";

import { useProblemStore } from "../store/useProblemStore";
import { Loader } from "lucide-react";
import ProblemTable from "../components/ProblemTable";

const HomePage = () => {
  const { getAllProblems, problems, isProblemsLoading } = useProblemStore();

  useEffect(() => {
    getAllProblems();
  }, [getAllProblems]);

  if(isProblemsLoading){
    return (
      <div className="flex items-center justify-center h-screen gradient-bg">
          <Loader className="size-10 animate-spin text-primary"/>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <section className="hero min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-16 left-0 w-1/3 h-1/3 bg-primary/20 opacity-30 blur-3xl rounded-full animate-pulse delay-100"></div>
          <div className="absolute bottom-16 right-0 w-1/4 h-1/4 bg-secondary/20 opacity-30 blur-3xl rounded-full animate-pulse delay-300"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 animate-float"></div>
        </div>
        
        <div className="hero-content text-center z-10 max-w-6xl mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
              <span className="gradient-text">Master Coding</span>
              <br />
              <span className="gradient-text-primary">Interviews</span>
            </h1>
            
            <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              A Platform Inspired by Leetcode which helps you to prepare for coding
              interviews and helps you to improve your coding skills by solving coding
              problems
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <button className="btn btn-lg bg-gradient-to-r from-primary to-secondary text-dark-navy border-0 hover-glow font-bold text-lg px-8 rounded-xl">
                Start Coding Now
              </button>
              <button className="btn btn-lg btn-outline border-primary text-primary hover:bg-primary/10 hover:border-primary hover:text-primary font-bold text-lg px-8 rounded-xl transition-all duration-300">
                Browse Problems
              </button>
            </div>

            <div className="mockup-code glass-effect max-w-4xl mx-auto text-left animate-glow">
              <div className="flex items-center gap-2 px-6 py-3 border-b border-primary/20">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-400 text-sm ml-4">two-sum.js</span>
              </div>
              <div className="px-6 py-4 text-sm md:text-base leading-relaxed">
                <div><span className="code-primary">function</span> <span className="code-secondary">twoSum</span><span className="text-white">(nums, target) &#123;</span></div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="code-primary">const</span> map = <span className="code-primary">new</span> <span className="code-secondary">Map</span>();</div>
                <div>&nbsp;</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="code-primary">for</span> (<span className="code-primary">let</span> i = <span className="code-success">0</span>; i &lt; nums.length; i++) &#123;</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="code-primary">const</span> complement = target - nums[i];</div>
                <div>&nbsp;</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="code-primary">if</span> (map.<span className="code-secondary">has</span>(complement)) &#123;</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="code-primary">return</span> [map.<span className="code-secondary">get</span>(complement), i];</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;</div>
                <div>&nbsp;</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;map.<span className="code-secondary">set</span>(nums[i], i);</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&#125;</div>
                <div>&nbsp;</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="code-primary">return</span> [];</div>
                <div>&#125;</div>
                <div>&nbsp;</div>
                <div><span className="code-comment">// Time: O(n) | Space: O(n)</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 gradient-bg-light">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 gradient-text">
            Why Choose StackSolve?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass-effect rounded-2xl p-8 cursor-pointer">
              <div className="text-4xl mb-6 text-center text-primary font-bold">TARGET</div>
              <h3 className="text-2xl font-bold mb-4 text-center gradient-text-primary">Curated Problems</h3>
              <p className="text-gray-300 text-center leading-relaxed">
                Hand-picked coding problems from top Indian and global tech companies to help you prepare for real interviews.
              </p>
            </div>

            <div className="glass-effect rounded-2xl p-8 cursor-pointer">
              <div className="text-4xl mb-6 text-center text-secondary font-bold">TRACK</div>
              <h3 className="text-2xl font-bold mb-4 text-center gradient-text-primary">Progress Tracking</h3>
              <p className="text-gray-300 text-center leading-relaxed">
                Track your learning journey with detailed analytics, performance insights, and personalized recommendations.
              </p>
            </div>

            <div className="glass-effect rounded-2xl p-8 cursor-pointer">
              <div className="text-4xl mb-6 text-center text-primary font-bold">COMPETE</div>
              <h3 className="text-2xl font-bold mb-4 text-center gradient-text-primary">Competitions</h3>
              <p className="text-gray-300 text-center leading-relaxed">
                Participate in coding contests, challenge yourself, and compete with developers across India.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              Featured Problems
            </h2>
            <p className="text-xl text-gray-300">
              Start your coding journey with these carefully selected challenges
            </p>
          </div>
          
          {
            problems.length > 0 ? (
              <ProblemTable problems={problems}/>
            ) : (
              <div className="text-center">
                <div className="glass-effect rounded-2xl p-12 max-w-md mx-auto">
                  <div className="text-4xl mb-6 text-primary font-bold">SEARCH</div>
                  <h3 className="text-2xl font-bold mb-4 gradient-text-primary">No Problems Found</h3>
                  <p className="text-gray-300">
                    Problems will appear here once they're added to the platform.
                  </p>
                </div>
              </div>
            )
          }
        </div>
      </section>

      <footer className="py-16 px-4 gradient-bg-light border-t border-primary/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                  <img src="/stacksolve-icon.svg" alt="StackSolve" className="h-6 w-6" />
                </div>
                <span className="text-2xl font-bold gradient-text">StackSolve</span>
              </div>
              <p className="text-gray-300 mb-4 max-w-md">
                Master coding interviews with our comprehensive platform designed for Indian developers. Practice, learn, and succeed.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">Terms of Service</a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Problems</a></li>
                <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Contests</a></li>
                <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Discuss</a></li>
                <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Interview Prep</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2025 StackSolve. Built with passion for Indian developers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
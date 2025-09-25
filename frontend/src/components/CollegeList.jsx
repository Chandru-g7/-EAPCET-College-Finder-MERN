import { useState, useEffect } from "react";
import axios from "axios";
import './CollegeFinder.css';

export default function CollegeFinder() {
  const [filters, setFilters] = useState({
    rank: "",
    branch: "ALL",
    category: "ALL",
    district: "ALL",
    region: "ALL",
  });

  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedCollege, setExpandedCollege] = useState(null);

  // Sample data for statistics
  const [stats, setStats] = useState({
    totalColleges: 1250,
    availableSeats: 85600,
    topCollege: "JNTU Kakinada"
  });

  useEffect(() => {
    // Load initial data or statistics
    fetchInitialStats();
  }, []);

  const fetchInitialStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/stats');
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load statistics");
    }
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const fetchColleges = async () => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams(filters).toString();
      const res = await axios.get(`http://localhost:5000/colleges?${params}`);
      setColleges(res.data);
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to fetch colleges. Try again."
      );
      setColleges([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchColleges();
    }
  };

  const toggleCollegeDetails = (index) => {
    setExpandedCollege(expandedCollege === index ? null : index);
  };

  const clearFilters = () => {
    setFilters({
      rank: "",
      branch: "ALL",
      category: "ALL",
      district: "ALL",
      region: "ALL",
    });
    setColleges([]);
    setError("");
  };

  const getRankColor = (rank, cutoff) => {
    if (!rank || !cutoff) return 'neutral';
    const rankNum = parseInt(rank);
    const cutoffNum = parseInt(cutoff);
    if (rankNum <= cutoffNum * 0.5) return 'safe';
    if (rankNum <= cutoffNum * 0.8) return 'moderate';
    return 'risky';
  };

  return (
    <div className="college-finder">
      {/* Header Section */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo-section">
              <h1 className="logo">EAPCET College Finder</h1>
              <p className="tagline">Find Your Perfect Engineering College</p>
            </div>
            <div className="stats-section">
              <div className="stat-card">
                <span className="stat-number">{stats.totalColleges}+</span>
                <span className="stat-label">Colleges</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{stats.availableSeats}</span>
                <span className="stat-label">Available Seats</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {/* Filters Card */}
          <div className="filters-card">
            <div className="card-header">
              <h3>Search Filters</h3>
              <button className="clear-btn" onClick={clearFilters}>
                Clear All
              </button>
            </div>
            
            <div className="filters-grid">
              <div className="filter-group">
                <label htmlFor="rank">Your Rank *</label>
                <input
                  id="rank"
                  type="number"
                  name="rank"
                  placeholder="Enter your EAPCET rank"
                  value={filters.rank}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className="rank-input"
                />
              </div>

              <div className="filter-group">
                <label htmlFor="branch">Preferred Branch</label>
                <select 
                  id="branch"
                  name="branch" 
                  value={filters.branch} 
                  onChange={handleChange}
                >
                  <option value="ALL">All Branches</option>
                  <option value="CSE">Computer Science (CSE)</option>
                  <option value="CSM">CSE - AI & ML</option>
                  <option value="CSD">CSE - Data Science</option>
                  <option value="INF">Information Technology</option>
                  <option value="ECE">Electronics & Communication</option>
                  <option value="EEE">Electrical & Electronics</option>
                  <option value="MECH">Mechanical Engineering</option>
                  <option value="CIVIL">Civil Engineering</option>
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="category">Category *</label>
                <select 
                  id="category"
                  name="category" 
                  value={filters.category} 
                  onChange={handleChange}
                >
                  <option value="ALL">All Categories</option>
                  <optgroup label="Open Category">
                    <option value="OC_BOYS">OC - Boys</option>
                    <option value="OC_GIRLS">OC - Girls</option>
                  </optgroup>
                  <optgroup label="BC Categories">
                    <option value="BCA_BOYS">BC-A - Boys</option>
                    <option value="BCA_GIRLS">BC-A - Girls</option>
                    <option value="BCB_BOYS">BC-B - Boys</option>
                    <option value="BCB_GIRLS">BC-B - Girls</option>
                  </optgroup>
                  <optgroup label="Reserved Categories">
                    <option value="SC_BOYS">SC - Boys</option>
                    <option value="SC_GIRLS">SC - Girls</option>
                    <option value="ST_BOYS">ST - Boys</option>
                    <option value="ST_GIRLS">ST - Girls</option>
                  </optgroup>
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="district">District</label>
                <select
                  id="district"
                  name="district"
                  value={filters.district}
                  onChange={handleChange}
                >
                  <option value="ALL">All Districts</option>
                  <option value="ATP">Anantapur (ATP)</option>
                  <option value="CTR">Chittoor (CTR)</option>
                  <option value="EG">East Godavari (EG)</option>
                  <option value="GTR">Guntur (GTR)</option>
                  <option value="KDP">Kadapa (KDP)</option>
                  <option value="KNL">Kurnool (KNL)</option>
                  <option value="KRI">Krishna (KRI)</option>
                  <option value="NLR">Nellore (NLR)</option>
                  <option value="PKS">Prakasam (PKS)</option>
                  <option value="SKL">Srikakulam (SKL)</option>
                  <option value="VSP">Visakhapatnam (VSP)</option>
                  <option value="VZM">Vizianagaram (VZM)</option>
                  <option value="WG">West Godavari (WG)</option>
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="region">University Region</label>
                <select 
                  id="region"
                  name="region" 
                  value={filters.region} 
                  onChange={handleChange}
                >
                  <option value="ALL">All Regions</option>
                  <option value="AU">Andhra University (AU)</option>
                  <option value="SVU">Sri Venkateswara University (SVU)</option>
                  <option value="OU">Osmania University (OU)</option>
                </select>
              </div>
            </div>

            <button 
              className="search-btn" 
              onClick={fetchColleges}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Searching...
                </>
              ) : (
                'Find Colleges'
              )}
            </button>
          </div>

          {/* Active Filters Summary */}
          {(filters.rank || filters.branch !== "ALL" || filters.category !== "ALL" || filters.district !== "ALL" || filters.region !== "ALL") && (
            <div className="filters-summary">
              <h4>Active Filters:</h4>
              <div className="filter-tags">
                {filters.rank && (
                  <span className="filter-tag">
                    Rank: {filters.rank}
                    <button onClick={() => setFilters({...filters, rank: ""})}>×</button>
                  </span>
                )}
                {filters.branch !== "ALL" && (
                  <span className="filter-tag">
                    Branch: {filters.branch}
                    <button onClick={() => setFilters({...filters, branch: "ALL"})}>×</button>
                  </span>
                )}
                {filters.category !== "ALL" && (
                  <span className="filter-tag">
                    Category: {filters.category.replace(/_/g, ' ')}
                    <button onClick={() => setFilters({...filters, category: "ALL"})}>×</button>
                  </span>
                )}
                {filters.district !== "ALL" && (
                  <span className="filter-tag">
                    District: {filters.district}
                    <button onClick={() => setFilters({...filters, district: "ALL"})}>×</button>
                  </span>
                )}
                {filters.region !== "ALL" && (
                  <span className="filter-tag">
                    Region: {filters.region}
                    <button onClick={() => setFilters({...filters, region: "ALL"})}>×</button>
                  </span>
                )}
              </div>
              
              {/* Warning message when category is not selected */}
              {filters.category === "ALL" && (
                <div className="category-warning">
                  <span className="warning-icon">⚠️</span>
                  <span className="warning-text">
                    To get accurate cutoff ranks, please select a specific category.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Loading/Error States */}
          {loading && (
            <div className="loading-state">
              <div className="spinner-large"></div>
              <p>Searching for colleges...</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <div className="error-icon">⚠️</div>
              <h4>Search Error</h4>
              <p>{error}</p>
              <button onClick={fetchColleges} className="retry-btn">
                Try Again
              </button>
            </div>
          )}

          {/* Results Section */}
          {colleges.length > 0 && (
            <div className="results-section">
              <div className="results-header">
                <h3>Found {colleges.length} Entries</h3>
              </div>

              {/* Warning message in results when category is not selected */}
              {filters.category === "ALL" && (
                <div className="results-warning">
                  <div className="warning-banner">
                    <span className="warning-icon">ℹ️</span>
                    <div className="warning-content">
                      <strong>Category Not Selected</strong>
                      <p>Cutoff ranks vary by category. Select a specific category to see accurate cutoff rankings.</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="colleges-list">
                {colleges.map((college, index) => (
                  <div 
                    key={college._id} 
                    className={`college-card ${getRankColor(filters.rank, college.selected_cutoff)}`}
                  >
                    <div className="college-header">
                      <div className="college-basic-info">
                        <span className="college-rank">#{index + 1}</span>
                        <h4 className="college-name">{college.COLLEGE}</h4>
                        <span className="college-code">{college.INSTCODE}</span>
                      </div>
                    </div>

                    <div className="college-details">
                      <div className="detail-grid">
                        <div className="detail-item">
                          <label>Region</label>
                          <span>{college.REG}</span>
                        </div>
                        <div className="detail-item">
                          <label>District</label>
                          <span>{college.DIST}</span>
                        </div>
                        <div className="detail-item">
                          <label>Affiliation</label>
                          <span>{college.AFF}</span>
                        </div>
                        <div className="detail-item">
                          <label>Established</label>
                          <span>{college.ESTD}</span>
                        </div>
                        <div className="detail-item">
                          <label>Branch</label>
                          <span className="branch-badge">{college.branch_code}</span>
                        </div>
                        <div className="detail-item">
                          <label>Cutoff Rank</label>
                          <span className={`cutoff-rank ${getRankColor(filters.rank, college.selected_cutoff)}`}>
                            {college.selected_cutoff || "N/A"}
                            {filters.category === "ALL" && (
                              <span className="cutoff-note"> (All Categories)</span>
                            )}
                          </span>
                        </div>
                      </div>

                      {expandedCollege === index && (
                        <div className="college-expanded">
                          <div className="additional-info">
                            <h5>Additional Information</h5>
                            <p>More details about the college would appear here...</p>
                          </div>
                          <div className="action-buttons">
                            <button className="btn-secondary">View College Website</button>
                            <button className="btn-primary">Add to Favorites</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {colleges.length === 0 && !loading && !error && (
            <div className="empty-state">
              <div className="empty-icon">🎓</div>
              <h4>No Colleges Found</h4>
              <p>Try adjusting your filters to see more results</p>
              {filters.category === "ALL" && (
                <div className="empty-state-warning">
                  <p>💡 <strong>Tip:</strong> Select a specific category to see accurate cutoff ranks.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>© 2024 EAPCET College Finder. Official data source: APSCHE.</p>
          <p>Developed by GCS</p>
        </div>
      </footer>
    </div>
  );
}
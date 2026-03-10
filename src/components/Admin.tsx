import React, { useState } from 'react';
import { usePortfolio, PortfolioData } from '../context/PortfolioContext';
import { Save, Upload, Plus, Trash2, LogOut, ChevronLeft, Zap } from 'lucide-react';

export default function Admin({ onBack }: { onBack: () => void }) {
  const { data, loading, updatePortfolio, uploadImage, error: contextError } = usePortfolio();
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [localData, setLocalData] = useState<PortfolioData | null>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'loading' | null, message: string }>({ type: null, message: '' });
  const [isUploading, setIsUploading] = useState<string | null>(null); // path of item being uploaded
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    if (contextError) {
      setStatus({ type: 'error', message: contextError });
    }
  }, [contextError]);

  React.useEffect(() => {
    if (data && !localData) {
      setLocalData(data);
    }
  }, [data, localData]);

  if (loading) return <div className="p-12 text-center">Loading...</div>;

  const handleLogin = async () => {
    setStatus({ type: 'loading', message: 'Verifying...' });
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      
      if (response.ok) {
        setIsLoggedIn(true);
        setStatus({ type: null, message: '' });
      } else {
        setStatus({ type: 'error', message: 'Invalid password' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Connection error' });
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
          <h1 className="text-2xl font-bold mb-6 text-slate-900">Admin Login</h1>
          {status.type === 'error' && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-bold text-center">
              {status.message}
            </div>
          )}
          <input
            type="password"
            placeholder="Enter Admin Password"
            className="w-full px-4 py-2 border border-slate-200 rounded-lg mb-4 focus:ring-2 focus:ring-slate-900 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button
            onClick={handleLogin}
            className="w-full py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-all"
          >
            Login
          </button>
          <button
            onClick={onBack}
            className="w-full mt-4 py-2 text-slate-500 font-medium hover:text-slate-900 transition-all flex items-center justify-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Portfolio
          </button>
        </div>
      </div>
    );
  }

  if (!localData) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Initializing Manager...</p>
      </div>
    </div>
  );

  const handleSave = async () => {
    if (!localData) return;
    setIsSaving(true);
    setStatus({ type: 'loading', message: 'Saving changes...' });
    const result = await updatePortfolio(localData, password);
    setIsSaving(false);
    if (result.success) {
      setStatus({ type: 'success', message: 'Portfolio updated successfully!' });
      setTimeout(() => setStatus({ type: null, message: '' }), 3000);
    } else {
      setStatus({ type: 'error', message: result.error || 'Update failed' });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, path: string) => {
    const file = e.target.files?.[0];
    if (!file || !localData) return;
    
    setIsUploading(path);
    try {
      let url: string | null = null;
      try {
        url = await uploadImage(file);
      } catch (uploadErr: any) {
        console.warn('Server upload failed, falling back to Base64:', uploadErr);
        // Fallback to Base64 if server upload fails (to satisfy "embedded" requirement)
        url = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }

      if (url) {
        const newData = JSON.parse(JSON.stringify(localData)); // Deep clone for safety
        if (path === 'profilePic') {
          newData.personalInfo.profilePic = url;
        } else if (path.startsWith('certifications.')) {
          const index = parseInt(path.split('.')[1]);
          if (newData.certifications[index]) {
            newData.certifications[index].image = url;
          }
        } else if (path.startsWith('learningJourney.')) {
          const index = parseInt(path.split('.')[1]);
          if (newData.learningJourney[index]) {
            newData.learningJourney[index].image = url;
          }
        }
        setLocalData(newData);
        setStatus({ type: 'success', message: 'Image processed successfully!' });
        setTimeout(() => setStatus({ type: null, message: '' }), 2000);
      }
    } catch (err: any) {
      setStatus({ type: 'error', message: `Upload failed: ${err.message}` });
    } finally {
      setIsUploading(null);
    }
  };

  const updatePersonalInfo = (field: string, value: string) => {
    if (!localData) return;
    setLocalData({
      ...localData,
      personalInfo: { ...localData.personalInfo, [field]: value }
    });
  };

  const updateStats = (field: string, value: string) => {
    if (!localData) return;
    setLocalData({
      ...localData,
      personalInfo: {
        ...localData.personalInfo,
        stats: { ...localData.personalInfo.stats, [field]: value }
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Portfolio Manager</h1>
            <p className="text-slate-500">Update your content anytime.</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={isSaving || !!isUploading}
              className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} /> 
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={() => setIsLoggedIn(false)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        {status.message && (
          <div className={`mb-6 p-4 rounded-xl font-bold text-center flex items-center justify-center gap-2 ${
            status.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 
            status.type === 'loading' ? 'bg-blue-100 text-blue-700' :
            'bg-red-100 text-red-700'
          }`}>
            {status.type === 'loading' && <div className="w-4 h-4 border-2 border-blue-700 border-t-transparent rounded-full animate-spin" />}
            {status.message}
          </div>
        )}

        <div className="space-y-8">
          {/* Personal Info */}
          <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b pb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                  value={localData.personalInfo.name}
                  onChange={(e) => updatePersonalInfo('name', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Professional Title</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                  value={localData.personalInfo.title}
                  onChange={(e) => updatePersonalInfo('title', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                  value={localData.personalInfo.email}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Location</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                  value={localData.personalInfo.location}
                  onChange={(e) => updatePersonalInfo('location', e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Availability Banner</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                  value={localData.personalInfo.availability}
                  onChange={(e) => updatePersonalInfo('availability', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Portfolio Managed (€)</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                  value={localData.personalInfo.stats.portfolioManaged}
                  onChange={(e) => updateStats('portfolioManaged', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Available From</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                  value={localData.personalInfo.stats.availableFrom}
                  onChange={(e) => updateStats('availableFrom', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">GitHub URL</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                  value={localData.personalInfo.github}
                  onChange={(e) => updatePersonalInfo('github', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">LinkedIn URL</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                  value={localData.personalInfo.linkedin}
                  onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Profile Picture</label>
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-400 to-blue-500 rounded-full opacity-20 blur group-hover:opacity-40 transition-opacity"></div>
                    <img 
                      src={localData.personalInfo.profilePic || 'https://picsum.photos/seed/profile/200/200'} 
                      className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg relative z-10" 
                      alt="" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/profile/200/200';
                      }}
                    />
                    {isUploading === 'profilePic' && (
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center z-20">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <label className={`cursor-pointer px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-all flex items-center gap-2 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <Upload className="w-4 h-4" /> {isUploading === 'profilePic' ? 'Uploading...' : 'Upload & Save'}
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          disabled={!!isUploading}
                          onChange={(e) => handleImageUpload(e, 'profilePic')} 
                        />
                      </label>
                      <button
                        onClick={async () => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.onchange = async (e: any) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setIsUploading('profilePic');
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const newData = JSON.parse(JSON.stringify(localData));
                              newData.personalInfo.profilePic = reader.result as string;
                              setLocalData(newData);
                              setIsUploading(null);
                              setStatus({ type: 'success', message: 'Image embedded as Base64!' });
                              setTimeout(() => setStatus({ type: null, message: '' }), 2000);
                            };
                            reader.readAsDataURL(file);
                          };
                          input.click();
                        }}
                        className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
                      >
                        <Zap className="w-4 h-4" /> Embed (Base64)
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium max-w-xs">
                      Use "Upload & Save" for standard hosting, or "Embed" to save the image directly in the data file (better for portability).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Projects */}
          <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">Projects</h2>
              <button 
                onClick={() => {
                  if (!localData) return;
                  const newProject = {
                    id: Date.now(),
                    title: "New Project",
                    domain: "Domain",
                    description: "Description",
                    skills: [],
                    links: [],
                    icon: "Code2"
                  };
                  setLocalData({ ...localData, projects: [newProject, ...(localData.projects || [])] });
                }}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold"
              >
                <Plus className="w-4 h-4" /> Add Project
              </button>
            </div>
            <div className="space-y-6">
              {(localData.projects || []).map((project, idx) => (
                <div key={project.id} className="p-6 border border-slate-100 rounded-xl bg-slate-50/50 relative group">
                  <button 
                    onClick={() => {
                      const newProjects = (localData.projects || []).filter((_, i) => i !== idx);
                      setLocalData({ ...localData, projects: newProjects });
                    }}
                    className="absolute top-4 right-4 p-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Project Title"
                      className="px-3 py-2 border rounded-lg font-bold"
                      value={project.title}
                      onChange={(e) => {
                        const newProjects = [...(localData.projects || [])];
                        newProjects[idx].title = e.target.value;
                        setLocalData({ ...localData, projects: newProjects });
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Domain"
                      className="px-3 py-2 border rounded-lg"
                      value={project.domain}
                      onChange={(e) => {
                        const newProjects = [...(localData.projects || [])];
                        newProjects[idx].domain = e.target.value;
                        setLocalData({ ...localData, projects: newProjects });
                      }}
                    />
                    <textarea
                      placeholder="Description"
                      className="md:col-span-2 px-3 py-2 border rounded-lg h-24"
                      value={project.description}
                      onChange={(e) => {
                        const newProjects = [...(localData.projects || [])];
                        newProjects[idx].description = e.target.value;
                        setLocalData({ ...localData, projects: newProjects });
                      }}
                    />
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Links (JSON format)</label>
                      <textarea
                        className="w-full px-3 py-2 border rounded-lg font-mono text-xs h-20"
                        value={JSON.stringify(project.links || [], null, 2)}
                        onChange={(e) => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            const newProjects = [...(localData.projects || [])];
                            newProjects[idx].links = parsed;
                            setLocalData({ ...localData, projects: newProjects });
                          } catch (err) {}
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Experience */}
          <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">Experience</h2>
              <button 
                onClick={() => {
                  if (!localData) return;
                  const newExp = {
                    id: Date.now(),
                    role: "New Role",
                    company: "Company",
                    period: "Period",
                    location: "Location",
                    highlights: ["Highlight 1"],
                    type: "banking"
                  };
                  setLocalData({ ...localData, experiences: [newExp, ...(localData.experiences || [])] });
                }}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold"
              >
                <Plus className="w-4 h-4" /> Add Experience
              </button>
            </div>
            <div className="space-y-6">
              {(localData.experiences || []).map((exp, idx) => (
                <div key={exp.id} className="p-6 border border-slate-100 rounded-xl bg-slate-50/50 relative group">
                  <button 
                    onClick={() => {
                      const newExps = (localData.experiences || []).filter((_, i) => i !== idx);
                      setLocalData({ ...localData, experiences: newExps });
                    }}
                    className="absolute top-4 right-4 p-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Role"
                      className="px-3 py-2 border rounded-lg font-bold"
                      value={exp.role}
                      onChange={(e) => {
                        const newExps = [...(localData.experiences || [])];
                        newExps[idx].role = e.target.value;
                        setLocalData({ ...localData, experiences: newExps });
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Company"
                      className="px-3 py-2 border rounded-lg"
                      value={exp.company}
                      onChange={(e) => {
                        const newExps = [...(localData.experiences || [])];
                        newExps[idx].company = e.target.value;
                        setLocalData({ ...localData, experiences: newExps });
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Period"
                      className="px-3 py-2 border rounded-lg"
                      value={exp.period}
                      onChange={(e) => {
                        const newExps = [...(localData.experiences || [])];
                        newExps[idx].period = e.target.value;
                        setLocalData({ ...localData, experiences: newExps });
                      }}
                    />
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Highlights (one per line)</label>
                      <textarea
                        className="w-full px-3 py-2 border rounded-lg h-24"
                        value={(exp.highlights || []).join('\n')}
                        onChange={(e) => {
                          const newExps = [...(localData.experiences || [])];
                          newExps[idx].highlights = e.target.value.split('\n');
                          setLocalData({ ...localData, experiences: newExps });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">Education</h2>
              <button 
                onClick={() => {
                  if (!localData) return;
                  const newEdu = {
                    id: Date.now(),
                    degree: "Degree Name",
                    school: "School Name",
                    period: "Period",
                    location: "Location",
                    details: "Details"
                  };
                  setLocalData({ ...localData, education: [newEdu, ...(localData.education || [])] });
                }}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold"
              >
                <Plus className="w-4 h-4" /> Add Education
              </button>
            </div>
            <div className="space-y-6">
              {(localData.education || []).map((edu, idx) => (
                <div key={edu.id} className="p-6 border border-slate-100 rounded-xl bg-slate-50/50 relative group">
                  <button 
                    onClick={() => {
                      const newEdu = (localData.education || []).filter((_, i) => i !== idx);
                      setLocalData({ ...localData, education: newEdu });
                    }}
                    className="absolute top-4 right-4 p-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Degree"
                      className="px-3 py-2 border rounded-lg font-bold"
                      value={edu.degree}
                      onChange={(e) => {
                        const newEdu = [...(localData.education || [])];
                        newEdu[idx].degree = e.target.value;
                        setLocalData({ ...localData, education: newEdu });
                      }}
                    />
                    <input
                      type="text"
                      placeholder="School"
                      className="px-3 py-2 border rounded-lg"
                      value={edu.school}
                      onChange={(e) => {
                        const newEdu = [...(localData.education || [])];
                        newEdu[idx].school = e.target.value;
                        setLocalData({ ...localData, education: newEdu });
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Period"
                      className="px-3 py-2 border rounded-lg"
                      value={edu.period}
                      onChange={(e) => {
                        const newEdu = [...(localData.education || [])];
                        newEdu[idx].period = e.target.value;
                        setLocalData({ ...localData, education: newEdu });
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      className="px-3 py-2 border rounded-lg"
                      value={edu.location}
                      onChange={(e) => {
                        const newEdu = [...(localData.education || [])];
                        newEdu[idx].location = e.target.value;
                        setLocalData({ ...localData, education: newEdu });
                      }}
                    />
                    <textarea
                      placeholder="Details"
                      className="md:col-span-2 px-3 py-2 border rounded-lg h-20"
                      value={edu.details}
                      onChange={(e) => {
                        const newEdu = [...(localData.education || [])];
                        newEdu[idx].details = e.target.value;
                        setLocalData({ ...localData, education: newEdu });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Languages */}
          <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">Languages</h2>
              <button 
                onClick={() => {
                  if (!localData) return;
                  const newLang = { name: "Language", level: "Level" };
                  setLocalData({ ...localData, languages: [newLang, ...(localData.languages || [])] });
                }}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold"
              >
                <Plus className="w-4 h-4" /> Add Language
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(localData.languages || []).map((lang, idx) => (
                <div key={idx} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 relative group flex gap-4">
                  <button 
                    onClick={() => {
                      const newLangs = (localData.languages || []).filter((_, i) => i !== idx);
                      setLocalData({ ...localData, languages: newLangs });
                    }}
                    className="absolute top-2 right-2 p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  <input
                    type="text"
                    placeholder="Language"
                    className="flex-1 px-3 py-1 border rounded-lg font-bold text-sm"
                    value={lang.name}
                    onChange={(e) => {
                      const newLangs = [...(localData.languages || [])];
                      newLangs[idx].name = e.target.value;
                      setLocalData({ ...localData, languages: newLangs });
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Level"
                    className="flex-1 px-3 py-1 border rounded-lg text-sm"
                    value={lang.level}
                    onChange={(e) => {
                      const newLangs = [...(localData.languages || [])];
                      newLangs[idx].level = e.target.value;
                      setLocalData({ ...localData, languages: newLangs });
                    }}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold mb-6 border-b pb-4">Technical Stack</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {(Object.entries(localData.skills || {}) as [string, any][]).map(([key, group]) => (
                <div key={key} className="p-6 border border-slate-100 rounded-xl bg-slate-50/50 space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Group Title</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg font-bold"
                      value={group.title}
                      onChange={(e) => {
                        const newSkills = { ...(localData.skills || {}) };
                        newSkills[key].title = e.target.value;
                        setLocalData({ ...localData, skills: newSkills });
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Items (comma separated)</label>
                    <textarea
                      className="w-full px-3 py-2 border rounded-lg h-20 text-sm"
                      value={(group.items || []).join(', ')}
                      onChange={(e) => {
                        const newSkills = { ...(localData.skills || {}) };
                        newSkills[key].items = e.target.value.split(',').map(s => s.trim()).filter(s => s !== '');
                        setLocalData({ ...localData, skills: newSkills });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Soft Skills */}
          <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold mb-6 border-b pb-4">Strategic Soft Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(localData.soft_skills || []).map((skill, idx) => (
                <div key={idx} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 space-y-3">
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg font-bold text-sm"
                    value={skill.category}
                    onChange={(e) => {
                      const newSoftSkills = [...(localData.soft_skills || [])];
                      newSoftSkills[idx].category = e.target.value;
                      setLocalData({ ...localData, soft_skills: newSoftSkills });
                    }}
                  />
                  <textarea
                    className="w-full px-3 py-2 border rounded-lg h-20 text-xs"
                    placeholder="Items (comma separated)"
                    value={(skill.items || []).join(', ')}
                    onChange={(e) => {
                      const newSoftSkills = [...(localData.soft_skills || [])];
                      newSoftSkills[idx].items = e.target.value.split(',').map(s => s.trim()).filter(s => s !== '');
                      setLocalData({ ...localData, soft_skills: newSoftSkills });
                    }}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Learning Journey */}
          <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">Learning Journey</h2>
              <button 
                onClick={() => {
                  if (!localData) return;
                  const newItem = {
                    period: "2026",
                    title: "New Milestone",
                    subtitle: "Subtitle",
                    summary: "Summary",
                    image: "https://picsum.photos/seed/journey/800/600"
                  };
                  setLocalData({ ...localData, learningJourney: [newItem, ...(localData.learningJourney || [])] });
                }}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold"
              >
                <Plus className="w-4 h-4" /> Add Milestone
              </button>
            </div>
            <div className="space-y-6">
              {(localData.learningJourney || []).map((item, idx) => (
                <div key={idx} className="p-6 border border-slate-100 rounded-xl bg-slate-50/50 relative group">
                  <button 
                    onClick={() => {
                      const newJourney = (localData.learningJourney || []).filter((_, i) => i !== idx);
                      setLocalData({ ...localData, learningJourney: newJourney });
                    }}
                    className="absolute top-4 right-4 p-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-3">
                      <div className="relative aspect-video rounded-lg overflow-hidden border bg-slate-100 mb-2">
                        <img src={item.image} className="w-full h-full object-cover" alt="" />
                        <div className="flex flex-col gap-1">
                          <label className={`absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer transition-opacity ${isUploading === `learningJourney.${idx}` ? 'opacity-100' : ''}`}>
                            {isUploading === `learningJourney.${idx}` ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Upload className="w-4 h-4 text-white" />
                            )}
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              disabled={!!isUploading}
                              onChange={(e) => handleImageUpload(e, `learningJourney.${idx}`)} 
                            />
                          </label>
                          <button
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.onchange = (e: any) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setIsUploading(`learningJourney.${idx}`);
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  const newData = JSON.parse(JSON.stringify(localData));
                                  newData.learningJourney[idx].image = reader.result as string;
                                  setLocalData(newData);
                                  setIsUploading(null);
                                  setStatus({ type: 'success', message: 'Journey image embedded!' });
                                  setTimeout(() => setStatus({ type: null, message: '' }), 2000);
                                };
                                reader.readAsDataURL(file);
                              };
                              input.click();
                            }}
                            className="absolute bottom-2 right-2 p-1.5 bg-white/90 hover:bg-white rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            title="Embed as Base64"
                          >
                            <Zap className="w-3 h-3 text-emerald-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Period"
                        className="px-3 py-2 border rounded-lg font-bold"
                        value={item.period}
                        onChange={(e) => {
                          const newJourney = [...(localData.learningJourney || [])];
                          newJourney[idx].period = e.target.value;
                          setLocalData({ ...localData, learningJourney: newJourney });
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Title"
                        className="px-3 py-2 border rounded-lg font-bold"
                        value={item.title}
                        onChange={(e) => {
                          const newJourney = [...(localData.learningJourney || [])];
                          newJourney[idx].title = e.target.value;
                          setLocalData({ ...localData, learningJourney: newJourney });
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Subtitle"
                        className="md:col-span-2 px-3 py-2 border rounded-lg"
                        value={item.subtitle}
                        onChange={(e) => {
                          const newJourney = [...(localData.learningJourney || [])];
                          newJourney[idx].subtitle = e.target.value;
                          setLocalData({ ...localData, learningJourney: newJourney });
                        }}
                      />
                      <textarea
                        placeholder="Summary"
                        className="md:col-span-2 px-3 py-2 border rounded-lg h-24"
                        value={item.summary}
                        onChange={(e) => {
                          const newJourney = [...(localData.learningJourney || [])];
                          newJourney[idx].summary = e.target.value;
                          setLocalData({ ...localData, learningJourney: newJourney });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Certifications */}
          <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">Certifications</h2>
              <button 
                onClick={() => {
                  if (!localData) return;
                  const newCert = { 
                    title: "New Certificate", 
                    issuer: "Issuer", 
                    category: "Finance",
                    date: "2026",
                    description: "Description",
                    image: "https://picsum.photos/seed/new/400/300" 
                  };
                  setLocalData({ ...localData, certifications: [newCert, ...(localData.certifications || [])] });
                }}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold"
              >
                <Plus className="w-4 h-4" /> Add Certificate
              </button>
            </div>
            <div className="space-y-6">
              {(localData.certifications || []).map((cert, idx) => (
                <div key={idx} className="p-6 border border-slate-100 rounded-xl bg-slate-50/50 relative group">
                  <button 
                    onClick={() => {
                      const newCerts = (localData.certifications || []).filter((_, i) => i !== idx);
                      setLocalData({ ...localData, certifications: newCerts });
                    }}
                    className="absolute top-4 right-4 p-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-3">
                      <div className="relative aspect-video rounded-lg overflow-hidden border bg-slate-100 mb-2">
                        {cert.image?.toLowerCase().endsWith('.pdf') ? (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-200 text-slate-500">
                            <Plus className="w-8 h-8 mb-1" />
                            <span className="text-[10px] font-bold uppercase">PDF Document</span>
                          </div>
                        ) : (
                          <img src={cert.image} className="w-full h-full object-cover" alt="" />
                        )}
                        <div className="flex flex-col gap-1">
                          <label className={`absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer transition-opacity ${isUploading === `certifications.${idx}` ? 'opacity-100' : ''}`}>
                            {isUploading === `certifications.${idx}` ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Upload className="w-4 h-4 text-white" />
                            )}
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*,.pdf"
                              disabled={!!isUploading}
                              onChange={(e) => handleImageUpload(e, `certifications.${idx}`)} 
                            />
                          </label>
                          <button
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*,.pdf';
                              input.onchange = (e: any) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setIsUploading(`certifications.${idx}`);
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  const newData = JSON.parse(JSON.stringify(localData));
                                  newData.certifications[idx].image = reader.result as string;
                                  setLocalData(newData);
                                  setIsUploading(null);
                                  setStatus({ type: 'success', message: 'Certificate embedded!' });
                                  setTimeout(() => setStatus({ type: null, message: '' }), 2000);
                                };
                                reader.readAsDataURL(file);
                              };
                              input.click();
                            }}
                            className="absolute bottom-2 right-2 p-1.5 bg-white/90 hover:bg-white rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            title="Embed as Base64"
                          >
                            <Zap className="w-3 h-3 text-emerald-600" />
                          </button>
                        </div>
                      </div>
                      <p className="text-[10px] text-center text-slate-400 font-bold uppercase">Certificate Image</p>
                    </div>
                    <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Title</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border rounded-lg font-bold"
                          value={cert.title}
                          onChange={(e) => {
                            const newCerts = [...(localData.certifications || [])];
                            newCerts[idx].title = e.target.value;
                            setLocalData({ ...localData, certifications: newCerts });
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Issuer</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border rounded-lg"
                          value={cert.issuer}
                          onChange={(e) => {
                            const newCerts = [...(localData.certifications || [])];
                            newCerts[idx].issuer = e.target.value;
                            setLocalData({ ...localData, certifications: newCerts });
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Category</label>
                        <select
                          className="w-full px-3 py-2 border rounded-lg"
                          value={cert.category}
                          onChange={(e) => {
                            const newCerts = [...(localData.certifications || [])];
                            newCerts[idx].category = e.target.value;
                            setLocalData({ ...localData, certifications: newCerts });
                          }}
                        >
                          <option value="Finance">Finance</option>
                          <option value="AI & Data">AI & Data</option>
                          <option value="Management & Operations">Management & Operations</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Date</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border rounded-lg"
                          value={cert.date}
                          onChange={(e) => {
                            const newCerts = [...(localData.certifications || [])];
                            newCerts[idx].date = e.target.value;
                            setLocalData({ ...localData, certifications: newCerts });
                          }}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Recruiter Insight (Description)</label>
                        <textarea
                          className="w-full px-3 py-2 border rounded-lg h-20 text-sm"
                          value={cert.description}
                          onChange={(e) => {
                            const newCerts = [...(localData.certifications || [])];
                            newCerts[idx].description = e.target.value;
                            setLocalData({ ...localData, certifications: newCerts });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

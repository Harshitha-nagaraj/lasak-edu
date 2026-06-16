import React, { useEffect, useState } from 'react';
import { getFirestoreDb } from '../../lib/firebase';
import { collection, getDocs, query, orderBy, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { TESTIMONIALS } from '../../constants/testimonials';
import { useUserRole } from '../../hooks/useUserRole';

// ─── Types ────────────────────────────────────────────────────────────────────
interface TestResult {
  id: string;
  name: string;
  mobile: string;
  email: string;
  yearOfPassout: string;
  degree: string;
  counsellor: string;
  course: string;
  score: number;
  wrong: number;
  total: number;
  price: number;
  createdAt: any;
}

interface TestQuestion {
  question: string;
  options: string[];
  correct: number;
}

// ─── Default Question Bank ───────────────────────────────────────────────────
const IT_QUESTIONS: TestQuestion[] = [
  { question: "What does CPU stand for?", options: ["Central Process Unit", "Central Processing Unit", "Computer Processing Unit", "Control Processing Unit"], correct: 1 },
  { question: "Which data structure follows the LIFO principle?", options: ["Queue", "Array", "Stack", "Linked List"], correct: 2 },
  { question: "Which language is primarily used for Android app development?", options: ["Python", "Java", "PHP", "C"], correct: 1 },
  { question: "Which SQL command is used to retrieve data?", options: ["INSERT", "UPDATE", "SELECT", "DELETE"], correct: 2 },
  { question: "Which of the following is an operating system?", options: ["MySQL", "Oracle", "Windows", "HTML"], correct: 2 },
  { question: "What is the full form of RAM?", options: ["Random Access Memory", "Read Access Memory", "Run Access Memory", "Rapid Access Memory"], correct: 0 },
  { question: "Which protocol is used to transfer web pages?", options: ["FTP", "HTTP", "SMTP", "TCP"], correct: 1 },
  { question: "Which of the following is NOT a programming language?", options: ["Python", "Java", "HTML", "C++"], correct: 2 },
  { question: "What is the default port number of HTTP?", options: ["21", "25", "80", "443"], correct: 2 },
  { question: "Which database is a Relational Database Management System (RDBMS)?", options: ["MongoDB", "MySQL", "Redis", "Cassandra"], correct: 1 },
  { question: "What does OOP stand for?", options: ["Object Oriented Programming", "Object Organized Program", "Online Oriented Programming", "Open Object Programming"], correct: 0 },
  { question: "Which sorting algorithm has the best average-case time complexity?", options: ["Bubble Sort", "Selection Sort", "Quick Sort", "Linear Search"], correct: 2 },
  { question: "Which symbol is used for single-line comments in Java?", options: ["#", "<!-- -->", "//", "**"], correct: 2 },
  { question: "Which network topology uses a central hub?", options: ["Ring", "Bus", "Star", "Mesh"], correct: 2 },
  { question: "What does URL stand for?", options: ["Uniform Resource Locator", "Universal Resource Link", "Uniform Retrieval Locator", "Universal Retrieval Link"], correct: 0 },
  { question: "Which of the following is a cloud computing platform?", options: ["AWS", "Excel", "Notepad", "Photoshop"], correct: 0 },
  { question: "What is the primary key in a database?", options: ["Duplicate value field", "Unique identifier for records", "Foreign key field", "Null value field"], correct: 1 },
  { question: "Which data type is used to store decimal values in Java?", options: ["int", "char", "float", "boolean"], correct: 2 },
  { question: "Which cybersecurity attack attempts to steal information through fake emails?", options: ["DDoS", "SQL Injection", "Phishing", "Malware"], correct: 2 },
  { question: "What does AI stand for?", options: ["Automated Intelligence", "Artificial Intelligence", "Advanced Intelligence", "Automatic Information"], correct: 1 }
];


const MECH_QUESTIONS: TestQuestion[] = [
  { question: "What is the unit of stress in the SI system?", options: ["Newton (N)", "Pascal (Pa)", "Joule (J)", "Watt (W)"], correct: 1 },
  { question: "Hooke's Law is valid up to which limit?", options: ["Yield point", "Elastic limit", "Proportional limit", "Ultimate stress point"], correct: 2 },
  { question: "Which material property allows it to be drawn into thin wires?", options: ["Brittleness", "Malleability", "Ductility", "Hardness"], correct: 2 },
  { question: "A beam supported at both ends is called a:", options: ["Cantilever beam", "Simply supported beam", "Fixed beam", "Overhanging beam"], correct: 1 },
  { question: "What type of stress does a shaft experience when transmitting torque?", options: ["Tensile stress", "Compressive stress", "Torsional shear stress", "Bending stress"], correct: 2 },
  { question: "Which law of thermodynamics defines the concept of temperature?", options: ["Zeroth Law", "First Law", "Second Law", "Third Law"], correct: 0 },
  { question: "The First Law of Thermodynamics is a statement of:", options: ["Conservation of mass", "Conservation of momentum", "Conservation of energy", "Conservation of heat"], correct: 2 },
  { question: "Which thermodynamic cycle is considered the most efficient ideal cycle?", options: ["Otto cycle", "Diesel cycle", "Carnot cycle", "Rankine cycle"], correct: 2 },
  { question: "Heat transfer by actual movement of fluid molecules is known as:", options: ["Conduction", "Convection", "Radiation", "Insulation"], correct: 1 },
  { question: "What is the main working fluid in a steam power plant operating on the Rankine cycle?", options: ["Air", "Helium", "Water", "Carbon dioxide"], correct: 2 },
  { question: "What is the reciprocal of density called?", options: ["Specific weight", "Specific gravity", "Specific volume", "Viscosity"], correct: 2 },
  { question: "Bernoulli's equation is based on the conservation of:", options: ["Mass", "Momentum", "Energy", "Angular momentum"], correct: 2 },
  { question: "A fluid that has zero viscosity and is incompressible is called:", options: ["Real fluid", "Ideal fluid", "Newtonian fluid", "Non-Newtonian fluid"], correct: 1 },
  { question: "What device is used to measure the flow rate of a fluid in a pipe?", options: ["Pressure gauge", "Venturimeter", "Thermometer", "Anemometer"], correct: 1 },
  { question: "Which manufacturing process involves pouring molten metal into a mold cavity?", options: ["Forging", "Casting", "Welding", "Extrusion"], correct: 1 },
  { question: "Gears are primarily used to transmit:", options: ["Heat", "Power and motion", "Fluid pressure", "Electrical signals"], correct: 1 },
  { question: "Which bearing is designed to carry loads parallel to the shaft axis?", options: ["Radial bearing", "Thrust bearing", "Journal bearing", "Bush bearing"], correct: 1 },
  { question: "CNC stands for:", options: ["Computer Network Control", "Computerized Numerical Control", "Central Numerical Computation", "Control Network Computer"], correct: 1 },
  { question: "Brass is an alloy of which two metals?", options: ["Copper and Tin", "Copper and Zinc", "Iron and Carbon", "Aluminum and Copper"], correct: 1 },
  { question: "In a 4-stroke petrol engine, the standard sequence of strokes is:", options: ["Compression, Intake, Power, Exhaust", "Intake, Compression, Power, Exhaust", "Intake, Power, Compression, Exhaust", "Power, Intake, Compression, Exhaust"], correct: 1 }
];

const CIVIL_QUESTIONS: TestQuestion[] = [
  { question: "What is the unit of force in the SI system?", options: ["Pascal (Pa)", "Joule (J)", "Newton (N)", "Watt (W)"], correct: 2 },
  { question: "A beam that is fixed at one end and free at the other end is called a:", options: ["Simply supported beam", "Cantilever beam", "Overhanging beam", "Continuous beam"], correct: 1 },
  { question: "The ratio of change in dimension to the original dimension is called:", options: ["Stress", "Strain", "Young's Modulus", "Poisson's Ratio"], correct: 1 },
  { question: "Bending moment in a beam is maximum where the shear force is:", options: ["Maximum", "Minimum", "Zero or changes sign", "Constant"], correct: 2 },
  { question: "What is the main binding material in conventional concrete?", options: ["Sand", "Cement", "Gravel", "Water"], correct: 1 },
  { question: "The process of keeping concrete moist for a certain period after casting is called:", options: ["Compaction", "Curing", "Bleeding", "Segregation"], correct: 1 },
  { question: "Which test is commonly used to measure the workability of fresh concrete?", options: ["Slump test", "Compressive strength test", "Tensile strength test", "Soundness test"], correct: 0 },
  { question: "Concrete is very strong in compression but weak in:", options: ["Crushing", "Tension", "Shear", "Bearing"], correct: 1 },
  { question: "What is added to concrete to increase its tensile strength?", options: ["More sand", "Steel reinforcement bars (Rebar)", "Lime", "Fly ash"], correct: 1 },
  { question: "The resistance of a fluid to flow is called:", options: ["Surface tension", "Viscosity", "Buoyancy", "Capillarity"], correct: 1 },
  { question: "An ideal fluid is one which is:", options: ["Viscous and compressible", "Non-viscous and incompressible", "Viscous and incompressible", "Non-viscous and compressible"], correct: 1 },
  { question: "Atmospheric pressure at sea level is approximately:", options: ["10.13 kPa", "101.3 kPa", "1013 kPa", "1.013 kPa"], correct: 1 },
  { question: "The fundamental principle of surveying is to work from:", options: ["Part to whole", "Whole to part", "Lower to higher level", "Center to boundary"], correct: 1 },
  { question: "An instrument used for measuring horizontal and vertical angles precisely is a:", options: ["Levelling staff", "Theodolite", "Tape measure", "Odometer"], correct: 1 },
  { question: "Lines joining points of equal elevation on a map are called:", options: ["Isobars", "Contour lines", "Isotherms", "Meridian lines"], correct: 1 },
  { question: "Which of the following soil types has the smallest grain size?", options: ["Gravel", "Sand", "Silt", "Clay"], correct: 3 },
  { question: "The lowermost structural component of a building that transfers loads to the soil is the:", options: ["Column", "Slab", "Foundation", "Beam"], correct: 2 },
  { question: "Black cotton soil is notorious for its property of:", options: ["High permeability", "Swelling and shrinkage", "High bearing capacity", "Easy compaction"], correct: 1 },
  { question: "What is the standard cross-slope provided to highway pavements to drain off rainwater called?", options: ["Camber", "Super-elevation", "Gradient", "Curve"], correct: 0 },
  { question: "The separation of water or laitance from freshly mixed concrete to the surface is known as:", options: ["Segregation", "Bleeding", "Creep", "Shrinkage"], correct: 1 }
];

const DEFAULT_QUESTION_BANK: Record<string, TestQuestion[]> = {
  'Data Analytics': IT_QUESTIONS,
  'Python Full Stack': IT_QUESTIONS,
  'Java Full Stack': IT_QUESTIONS,
  'Digital Marketing': IT_QUESTIONS,
  'Software Testing': IT_QUESTIONS,
  'Mech Combo': MECH_QUESTIONS,
  'Civil Combo': CIVIL_QUESTIONS,
};

const LOGO_IMAGE_PATH = '/img/lasakedu-logo.png';

const EligibilityTests: React.FC = () => {
  const { role } = useUserRole();
  const isSales = role === 'sales';
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Tab State: submissions vs questions edit
  const [activeTab, setActiveTab] = useState<'submissions' | 'questions'>('submissions');
  const [questionsBank, setQuestionsBank] = useState<Record<string, TestQuestion[]>>({});
  const [selectedEditCourse, setSelectedEditCourse] = useState('Data Analytics');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const db = await getFirestoreDb();
        const q = query(collection(db, 'eligibilityTests'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const data: TestResult[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<TestResult, 'id'>),
        }));
        setResults(data);
      } catch (e: any) {
        toast.error(e.message ?? 'Failed to load test results');
      }
      setLoading(false);
    };

    const loadQuestions = async () => {
      try {
        const db = await getFirestoreDb();
        const docRef = doc(db, 'eligibilityConfig', 'questions');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data && data.questions) {
            // Slice all dynamic question pools to max 20
            const sliced: Record<string, TestQuestion[]> = {};
            Object.keys(data.questions).forEach(course => {
              sliced[course] = (data.questions[course] ?? []).slice(0, 20);
            });
            setQuestionsBank(sliced);
            return;
          }
        }
        // Fallback to default questions if document doesn't exist
        setQuestionsBank(DEFAULT_QUESTION_BANK);
      } catch (e: any) {
        console.error(e);
        toast.error('Failed to load eligibility questions from database');
        setQuestionsBank(DEFAULT_QUESTION_BANK);
      }
    };

    fetchResults();
    loadQuestions();
  }, []);

  useEffect(() => {
    if (isSales && activeTab === 'questions') {
      setActiveTab('submissions');
    }
  }, [isSales, activeTab]);

  const filtered = results.filter(r =>
    search === '' ||
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.course?.toLowerCase().includes(search.toLowerCase()) ||
    r.email?.toLowerCase().includes(search.toLowerCase())
  );

  const downloadCSV = () => {
    const headers = ['Name', 'Mobile', 'Email', 'Degree', 'Year Passed Out', 'Counsellor', 'Course', 'Score', 'Wrong', 'Total', 'Price (₹)', 'Date'];
    const rows = filtered.map(r => [
      r.name ?? '',
      r.mobile ?? '',
      r.email ?? '',
      r.degree ?? '',
      r.yearOfPassout ?? '',
      r.counsellor ?? '',
      r.course ?? '',
      r.score ?? 0,
      r.wrong ?? (r.total - r.score),
      r.total ?? 20,
      r.price ?? (((r.wrong ?? (r.total - r.score)) <= 2) ? 40000 : 45000),
      r.createdAt?.toDate ? r.createdAt.toDate().toLocaleString() : '',
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lasakedu_eligibility_tests_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('CSV downloaded!');
  };

  const downloadPDF = (r: TestResult) => {
    const wrong = r.wrong ?? (r.total - r.score);
    const price = r.price ?? (wrong <= 2 ? 40000 : 45000);
    const date = r.createdAt?.toDate ? r.createdAt.toDate().toLocaleString() : 'N/A';
    const logoUrl = window.location.origin + LOGO_IMAGE_PATH;
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>LASAK EDU – Eligibility Result</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; padding: 40px; color: #1e293b; }
            .header { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px 0; margin-bottom: 28px; border-bottom: 2px solid #e2e8f0; text-align: center; }
            .header-logo { height: 110px; width: auto; object-fit: contain; display: block; }
            .header-date { font-size: 11px; color: #64748b; margin-top: 8px; font-weight: 500; }
            .section { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px 24px; margin-bottom: 16px; }
            .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #64748b; margin-bottom: 12px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
            .field label { font-size: 11px; color: #94a3b8; font-weight: 600; display: block; margin-bottom: 2px; }
            .field span { font-size: 14px; font-weight: 700; color: #1e293b; }
            .score-row { display: flex; gap: 12px; margin-bottom: 16px; }
            .score-box { flex: 1; background: white; border-radius: 10px; padding: 14px; text-align: center; border: 2px solid #e2e8f0; }
            .score-box .num { font-size: 26px; font-weight: 900; }
            .score-box .lbl { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: 700; margin-top: 2px; }
            .correct .num { color: #16a34a; }
            .wrong .num { color: #dc2626; }
            .total .num { color: #2563eb; }
            .price-box { border-radius: 12px; padding: 20px 24px; text-align: center; border: 2px solid; margin-bottom: 20px; }
            .price-good { background: #f0fdf4; border-color: #86efac; }
            .price-std { background: #fffbeb; border-color: #fcd34d; }
            .price-label { font-size: 13px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; color: #1e293b; }
            .price-worth { font-size: 18px; color: #dc2626; font-weight: 800; margin: 12px 0; display: inline-block; background-color: #fee2e2; padding: 6px 18px; border-radius: 8px; border: 1.5px dashed #ef4444; }
            .price-worth s { color: #dc2626; text-decoration: line-through; text-decoration-color: #ef4444; text-decoration-thickness: 3px; }
            .price-amount { font-size: 38px; font-weight: 900; margin-top: 4px; }
            .price-good .price-amount { color: #16a34a; }
            .price-std .price-amount { color: #d97706; }
            .footer { text-align: center; font-size: 11px; color: #94a3b8; margin-top: 24px; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${logoUrl}" alt="LASAK EDU" class="header-logo" />
            <div class="header-date">${date}</div>
          </div>

          <div class="section">
            <div class="section-title">Student Information</div>
            <div class="grid">
              <div class="field"><label>Full Name</label><span>${r.name ?? ''}</span></div>
              <div class="field"><label>Mobile</label><span>${r.mobile ?? ''}</span></div>
              <div class="field"><label>Email</label><span>${r.email ?? ''}</span></div>
              <div class="field"><label>Degree</label><span>${r.degree ?? ''}</span></div>
              <div class="field"><label>Year of Passed Out</label><span>${r.yearOfPassout ?? ''}</span></div>
              <div class="field"><label>Counsellor</label><span>${r.counsellor || '—'}</span></div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Test Result – ${r.course ?? ''}</div>
            <div class="score-row">
              <div class="score-box correct"><div class="num">${r.score ?? 0}</div><div class="lbl">Correct</div></div>
              <div class="score-box wrong"><div class="num">${wrong}</div><div class="lbl">Wrong</div></div>
              <div class="score-box total"><div class="num">${r.total ?? 20}</div><div class="lbl">Total</div></div>
            </div>
          </div>

          <div class="price-box ${wrong <= 2 ? 'price-good' : 'price-std'}">
            <div class="price-label">🎓 Your Course Fee</div>
            <div class="price-worth">Course Worth: <s>₹70,000</s></div>
            <div class="price-amount">₹${price.toLocaleString('en-IN')}</div>
          </div>

          <div class="footer">LASAK EDU · Coimbatore · lasakedu.in · info@lasakedu.in · +91 78069 10746</div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            };
          </script>
        </body>
      </html>
    `;

    const win = window.open('', '_blank');
    if (win) {
      win.document.write(htmlContent);
      win.document.close();
    }
  };

  const handleDelete = async (id: string) => {
    if (isSales) return;
    if (!window.confirm('Are you sure you want to delete this test submission?')) {
      return;
    }
    try {
      const db = await getFirestoreDb();
      await deleteDoc(doc(db, 'eligibilityTests', id));
      setResults(prev => prev.filter(r => r.id !== id));
      toast.success('Submission deleted successfully');
    } catch (e: any) {
      console.error(e);
      toast.error(e.message ?? 'Failed to delete submission');
    }
  };

  const handleQuestionChange = (qIdx: number, value: string) => {
    setQuestionsBank(prev => {
      const updated = { ...prev };
      if (!updated[selectedEditCourse]) updated[selectedEditCourse] = [];
      const list = [...updated[selectedEditCourse]];
      list[qIdx] = { ...list[qIdx], question: value };
      updated[selectedEditCourse] = list;
      return updated;
    });
  };

  const handleOptionChange = (qIdx: number, optIdx: number, value: string) => {
    setQuestionsBank(prev => {
      const updated = { ...prev };
      if (!updated[selectedEditCourse]) updated[selectedEditCourse] = [];
      const list = [...updated[selectedEditCourse]];
      const opts = [...(list[qIdx]?.options ?? ['', '', '', ''])];
      opts[optIdx] = value;
      list[qIdx] = { ...list[qIdx], options: opts };
      updated[selectedEditCourse] = list;
      return updated;
    });
  };

  const handleCorrectChange = (qIdx: number, val: number) => {
    setQuestionsBank(prev => {
      const updated = { ...prev };
      if (!updated[selectedEditCourse]) updated[selectedEditCourse] = [];
      const list = [...updated[selectedEditCourse]];
      list[qIdx] = { ...list[qIdx], correct: val };
      updated[selectedEditCourse] = list;
      return updated;
    });
  };

  const handleSaveQuestions = async () => {
    if (isSales) return;
    setSaving(true);
    try {
      const db = await getFirestoreDb();
      await setDoc(doc(db, 'eligibilityConfig', 'questions'), {
        questions: questionsBank,
        updatedAt: new Date().toISOString()
      });
      toast.success('Eligibility questions saved successfully!');
    } catch (e: any) {
      console.error(e);
      toast.error(e.message ?? 'Failed to save questions');
    }
    setSaving(false);
  };

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm font-medium">Loading test results…</p>
      </div>
    </div>
  );

  const currentQuestions = questionsBank[selectedEditCourse] ?? [];

  return (
    <div className="p-6 lg:p-8">
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Eligibility Tests Manager</h1>
          <div className="flex gap-2 mt-2 bg-slate-100 p-1 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab('submissions')}
              className={`px-4 py-2 text-xs font-black rounded-lg transition-all ${activeTab === 'submissions' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              📋 Test Submissions
            </button>
            {!isSales && (
              <button
                onClick={() => setActiveTab('questions')}
                className={`px-4 py-2 text-xs font-black rounded-lg transition-all ${activeTab === 'questions' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                ✏️ Edit Questions
              </button>
            )}
          </div>
        </div>
        
        {activeTab === 'submissions' && (
          <button
            onClick={downloadCSV}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition text-sm active:scale-95"
          >
            ⬇️ Download CSV
          </button>
        )}
      </div>

      {activeTab === 'submissions' ? (
        <>
          {/* Search */}
          <div className="mb-5">
            <input
              type="text"
              placeholder="Search by name, email or course…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full sm:max-w-sm border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400 font-medium">No results found.</div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
              <table className="min-w-full bg-white text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    {['#', 'Name', 'Mobile', 'Email', 'Degree', 'Yr Passed', 'Counsellor', 'Course', 'Score', 'Wrong', 'Price', 'Date', 'PDF', !isSales && 'Actions']
                      .filter(Boolean)
                      .map(h => (
                        <th key={h as string} className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">{h as string}</th>
                      ))
                    }
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, idx) => {
                    const wrong = r.wrong ?? (r.total - r.score);
                    const price = r.price ?? (wrong <= 2 ? 40000 : 45000);
                    const isGood = wrong <= 2;
                    return (
                      <tr key={r.id} className={`border-b border-slate-100 hover:bg-blue-50/40 transition ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}>
                        <td className="px-4 py-3 text-slate-400 font-bold">{idx + 1}</td>
                        <td className="px-4 py-3 font-bold text-slate-800 whitespace-nowrap">{r.name}</td>
                        <td className="px-4 py-3 text-slate-600">{r.mobile}</td>
                        <td className="px-4 py-3 text-slate-600">{r.email}</td>
                        <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{r.degree}</td>
                        <td className="px-4 py-3 text-slate-600 text-center">{r.yearOfPassout}</td>
                        <td className="px-4 py-3 text-slate-600">{r.counsellor || '—'}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-lg text-xs">{r.course}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-black text-green-600">{r.score}</span>
                          <span className="text-slate-400">/{r.total ?? 20}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`font-black ${wrong > 2 ? 'text-red-500' : 'text-slate-400'}`}>{wrong}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`font-black text-base ${isGood ? 'text-green-600' : 'text-amber-600'}`}>
                            ₹{price.toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                          {r.createdAt?.toDate ? r.createdAt.toDate().toLocaleDateString('en-IN') : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => downloadPDF(r)}
                            className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition active:scale-95"
                            title="Download PDF"
                          >
                            🖨️ PDF
                          </button>
                        </td>
                        {!isSales && (
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleDelete(r.id)}
                              className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition active:scale-95"
                              title="Delete Submission"
                            >
                              🗑️ Delete
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-6 animate-fadeIn">
          {/* Course selector & Save button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <label className="text-sm font-bold text-slate-700">Select Course to Edit:</label>
              <select
                value={selectedEditCourse}
                onChange={e => setSelectedEditCourse(e.target.value)}
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none transition"
              >
                {['Data Analytics', 'Python Full Stack', 'Java Full Stack', 'Digital Marketing', 'Software Testing', 'Mech Combo', 'Civil Combo'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleSaveQuestions}
              disabled={saving}
              className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 text-white font-black rounded-xl transition shadow-lg shadow-green-100 text-sm active:scale-95"
            >
              {saving ? 'Saving...' : '💾 Save All Questions'}
            </button>
          </div>

          {/* List of 20 questions */}
          {currentQuestions.length === 0 ? (
            <div className="text-center py-12 text-slate-400 font-semibold">No questions found. Loading or setting up default...</div>
          ) : (
            <div className="space-y-4">
              {currentQuestions.map((q, qIdx) => (
                <div key={qIdx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                      Q{qIdx + 1}
                    </span>
                    <div className="flex-1 space-y-2">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Question Text</label>
                      <input
                        type="text"
                        value={q.question}
                        onChange={e => handleQuestionChange(qIdx, e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 font-bold focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                        placeholder={`Question ${qIdx + 1}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-11">
                    {q.options?.map((opt, optIdx) => (
                      <div key={optIdx} className="space-y-1">
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Option {String.fromCharCode(65 + optIdx)}</label>
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <input
                            type="text"
                            value={opt}
                            onChange={e => handleOptionChange(qIdx, optIdx, e.target.value)}
                            className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none transition"
                            placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 pl-11">
                    <span className="text-xs font-bold text-slate-500">Correct Option:</span>
                    <select
                      value={q.correct}
                      onChange={e => handleCorrectChange(qIdx, parseInt(e.target.value))}
                      className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 bg-slate-50 focus:outline-none focus:border-blue-500 transition font-bold"
                    >
                      {[0, 1, 2, 3].map(idx => (
                        <option key={idx} value={idx}>
                          Option {String.fromCharCode(65 + idx)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EligibilityTests;

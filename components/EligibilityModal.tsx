import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'react-hot-toast';
import { TESTIMONIALS } from '../constants/testimonials';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Question {
  question: string;
  options: string[];
  correct: number;
}

interface EligibilityModalProps {
  onClose: () => void;
}

// ─── Courses ──────────────────────────────────────────────────────────────────
const COURSES = [
  'Data Analytics',
  'Python Full Stack',
  'Java Full Stack',
  'Digital Marketing',
  'Software Testing',
  'Mech Combo',
  'Civil Combo',
];

// ─── Default Question Bank (20 per course) ───────────────────────────────────────────
const IT_QUESTIONS: Question[] = [
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


const MECH_QUESTIONS: Question[] = [
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

const CIVIL_QUESTIONS: Question[] = [
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

const QUESTION_BANK: Record<string, Question[]> = {
  'Data Analytics': IT_QUESTIONS,
  'Python Full Stack': IT_QUESTIONS,
  'Java Full Stack': IT_QUESTIONS,
  'Digital Marketing': IT_QUESTIONS,
  'Software Testing': IT_QUESTIONS,
  'Mech Combo': MECH_QUESTIONS,
  'Civil Combo': CIVIL_QUESTIONS,
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const EligibilityModal: React.FC<EligibilityModalProps> = ({ onClose }) => {
  const [step, setStep] = useState<'form' | 'course' | 'test' | 'result'>('form');
  const [loading, setLoading] = useState(false);

  // Step 1 – Form
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    email: '',
    yearOfPassout: '',
    degree: '',
    counsellor: '',
  });

  // Step 2 – Course
  const [selectedCourse, setSelectedCourse] = useState('');

  // Step 3 – Test
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQ, setCurrentQ] = useState(0);

  // Step 4 – Result
  const [score, setScore] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  // Questions Bank State (dynamically fetched from Firestore)
  const [questionsBank, setQuestionsBank] = useState<Record<string, Question[]>>(QUESTION_BANK);

  // Counsellors list (dynamically fetched from Firestore)
  const [counsellors, setCounsellors] = useState<string[]>(['Lakshman', 'Sangeetha']);

  useEffect(() => {
    const loadDynamicQuestions = async () => {
      try {
        const { getFirestoreDb } = await import('../lib/firebase');
        const { doc, getDoc } = await import('firebase/firestore');
        const db = await getFirestoreDb();
        const docRef = doc(db, 'eligibilityConfig', 'questions');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data && data.questions) {
            // Slice all dynamic question pools to max 20
            const sliced: Record<string, Question[]> = {};
            Object.keys(data.questions).forEach(course => {
              sliced[course] = (data.questions[course] ?? []).slice(0, 20);
            });
            setQuestionsBank(sliced);
          }
        }
      } catch (err) {
        console.error('Failed to load dynamic eligibility questions:', err);
      }
    };

    const loadDynamicCounsellors = async () => {
      try {
        const { getFirestoreDb } = await import('../lib/firebase');
        const { doc, getDoc } = await import('firebase/firestore');
        const db = await getFirestoreDb();
        const docRef = doc(db, 'eligibilityConfig', 'counsellors');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data && Array.isArray(data.counsellors)) {
            setCounsellors(data.counsellors);
          }
        }
      } catch (err) {
        console.error('Failed to load dynamic counsellors:', err);
      }
    };

    loadDynamicQuestions();
    loadDynamicCounsellors();
  }, []);

  const questions: Question[] = selectedCourse ? (questionsBank[selectedCourse] ?? []).slice(0, 20) : [];

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleFormNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.mobile || !form.email || !form.yearOfPassout || !form.degree) {
      toast.error('Please fill all fields');
      return;
    }
    setStep('course');
  };

  const handleCourseNext = () => {
    if (!selectedCourse) { toast.error('Please select a course'); return; }
    setStep('test');
    setCurrentQ(0);
    setAnswers({});
  };

  const handleAnswer = (qIdx: number, optIdx: number) => {
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmitTest = async () => {
    let correct = 0;
    questions.forEach((q, idx) => { if (answers[idx] === q.correct) correct++; });
    const wrong = questions.length - correct;
    setScore(correct);
    setWrongCount(wrong);
    setLoading(true);
    try {
      const { getFirestoreDb } = await import('../lib/firebase');
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
      const db = await getFirestoreDb();
      await addDoc(collection(db, 'eligibilityTests'), {
        name: form.name.trim(),
        mobile: form.mobile.trim(),
        email: form.email.trim().toLowerCase(),
        yearOfPassout: form.yearOfPassout.trim(),
        degree: form.degree.trim(),
        counsellor: form.counsellor.trim(),
        course: selectedCourse,
        score: correct,
        wrong,
        total: questions.length,
        answers,
        price: wrong <= 2 ? 40000 : 45000,
        createdAt: serverTimestamp(),
      });
      toast.success('Test submitted successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message ?? 'Submission failed');
    }
    setLoading(false);
    setStep('result');
  };

  const allAnswered = Object.keys(answers).length === questions.length;

  // ── Progress bar ───────────────────────────────────────────────────────────
  const stepIndex = { form: 0, course: 1, test: 2, result: 3 }[step];
  const steps = ['Your Info', 'Choose Course', 'Take Test', 'Result'];

  // ── Render ─────────────────────────────────────────────────────────────────
  return createPortal(
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-3 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-4xl max-h-[94vh] sm:max-h-[92vh] overflow-y-auto relative flex flex-col">

        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-3xl px-4 sm:px-6 pt-5 sm:pt-6 pb-4 z-10 border-b border-slate-100">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-600 transition text-sm sm:text-lg font-bold"
          >✕</button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-lg">L</div>
            <div>
              <h2 className="text-xl font-black text-slate-900 leading-tight">Eligibility Test</h2>
              <p className="text-xs text-slate-500 font-medium">LASAK EDU – Check your course eligibility</p>
            </div>
          </div>

          {/* Step Progress */}
          <div className="flex items-center gap-1">
            {steps.map((s, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${i < stepIndex ? 'bg-green-500 text-white' : i === stepIndex ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-200 text-slate-400'}`}>
                    {i < stepIndex ? '✓' : i + 1}
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-wide hidden sm:block ${i === stepIndex ? 'text-blue-600' : 'text-slate-400'}`}>{s}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 rounded transition-all ${i < stepIndex ? 'bg-green-400' : 'bg-slate-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="px-4 sm:px-6 py-5 sm:py-6 flex-1">

          {/* ── STEP 1: FORM ── */}
          {step === 'form' && (
            <form onSubmit={handleFormNext} className="space-y-4">
              <h3 className="text-lg font-black text-slate-800 mb-1">Tell us about yourself</h3>
              <p className="text-sm text-slate-500 mb-4">Fill in your details to begin the eligibility assessment.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: 'Full Name', key: 'name', placeholder: 'e.g. Arun Kumar', type: 'text' },
                  { label: 'Mobile Number', key: 'mobile', placeholder: 'e.g. 9876543210', type: 'tel' },
                  { label: 'Email ID', key: 'email', placeholder: 'e.g. arun@gmail.com', type: 'email' },
                  { label: 'Year of Passed Out', key: 'yearOfPassout', placeholder: 'e.g. 2023', type: 'text' },
                  { label: 'Degree', key: 'degree', placeholder: 'e.g. B.E. Mechanical', type: 'text' },
                  { label: 'Counsellor Name (optional)', key: 'counsellor', placeholder: 'e.g. Lakshman', type: 'text' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wide">{field.label}</label>
                    {field.key === 'counsellor' ? (
                      <select
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition text-sm cursor-pointer"
                        value={(form as any)[field.key]}
                        onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                      >
                        <option value="">Select Counsellor</option>
                        {counsellors.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition text-sm"
                        placeholder={field.placeholder}
                        value={(form as any)[field.key]}
                        onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                        required={field.key !== 'counsellor'}
                      />
                    )}
                  </div>
                ))}
              </div>

              <button type="submit" className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-black text-base hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-200 active:scale-95">
                Next → Choose Course
              </button>
            </form>
          )}

          {/* ── STEP 2: COURSE SELECT ── */}
          {step === 'course' && (
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-800 mb-1">Choose your course</h3>
              <p className="text-sm text-slate-500 mb-4">Select the course you want to be assessed for.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {COURSES.map(course => {
                  const icons: Record<string, string> = {
                    'Data Analytics': '📊',
                    'Python Full Stack': '🐍',
                    'Java Full Stack': '☕',
                    'Digital Marketing': '📣',
                    'Software Testing': '🧪',
                    'Mech Combo': '⚙️',
                    'Civil Combo': '🏗️',
                  };
                  const selected = selectedCourse === course;
                  return (
                    <button
                      key={course}
                      type="button"
                      onClick={() => setSelectedCourse(course)}
                      className={`flex items-center gap-3 px-5 py-4 rounded-2xl border-2 font-bold text-sm text-left transition-all active:scale-95 ${selected
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-lg shadow-blue-100'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50/50'}`}
                    >
                      <span className="text-2xl">{icons[course]}</span>
                      <span>{course}</span>
                      {selected && <span className="ml-auto text-blue-600">✓</span>}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3 mt-4">
                <button onClick={() => setStep('form')} className="flex-1 border-2 border-slate-200 text-slate-600 py-3 rounded-2xl font-bold hover:bg-slate-50 transition active:scale-95">← Back</button>
                <button
                  onClick={handleCourseNext}
                  disabled={!selectedCourse}
                  className="flex-2 flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-2xl font-black hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Start Test →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: TEST ── */}
          {step === 'test' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-800">{selectedCourse} – Eligibility Test</h3>
                <span className="text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                  {Object.keys(answers).length}/{questions.length} answered
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
                />
              </div>

              {/* Question navigation dots */}
              <div className="flex flex-wrap gap-1.5">
                {questions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentQ(i)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${i === currentQ ? 'bg-blue-600 text-white scale-110' : answers[i] !== undefined ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              {/* Current Question Card */}
              <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200 rounded-2xl p-5">
                <p className="font-black text-slate-800 mb-4 text-base leading-relaxed">
                  <span className="text-blue-600 mr-1">Q{currentQ + 1}.</span> {questions[currentQ]?.question}
                </p>
                <div className="space-y-2">
                  {questions[currentQ]?.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleAnswer(currentQ, oIdx)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 font-semibold text-sm text-left transition-all active:scale-[0.98] ${answers[currentQ] === oIdx
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50/50'}`}
                    >
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 ${answers[currentQ] === oIdx ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentQ(q => Math.max(0, q - 1))}
                  disabled={currentQ === 0}
                  className="flex-1 border-2 border-slate-200 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition disabled:opacity-30 active:scale-95"
                >← Prev</button>
                {currentQ < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQ(q => Math.min(questions.length - 1, q + 1))}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-2xl font-bold hover:bg-blue-700 transition active:scale-95"
                  >Next →</button>
                ) : (
                  <button
                    onClick={handleSubmitTest}
                    disabled={!allAnswered || loading}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-2xl font-black hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Submitting…' : '🏁 Submit Test'}
                  </button>
                )}
              </div>
              {!allAnswered && (
                <p className="text-center text-xs text-amber-600 font-semibold">
                  ⚠️ Answer all {questions.length} questions before submitting
                </p>
              )}
            </div>
          )}

          {/* ── STEP 4: RESULT ── */}
          {step === 'result' && (
            <div className="py-2">

              {/* Header */}
              <div className="text-center mb-5">
                <div className="text-5xl mb-3">{wrongCount <= 2 ? '🏆' : '📚'}</div>
                <h3 className="text-2xl font-black text-slate-900 mb-1">Thank you for attending!</h3>
                <p className="text-slate-500 text-sm font-medium">
                  Your result for <span className="font-bold text-blue-600">{selectedCourse}</span>
                </p>
              </div>

              {/* Student Info Card */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 mb-4 text-white text-left">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center font-black text-xl flex-shrink-0">
                    {form.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-black text-base leading-tight">{form.name}</p>
                    <p className="text-blue-200 text-xs">{form.degree} · {form.yearOfPassout}</p>
                  </div>
                </div>
                <div className="sm:ml-auto text-left sm:text-right flex-shrink-0">
                  <p className="text-blue-200 text-[10px] font-bold uppercase">Course</p>
                  <p className="font-black text-sm">{selectedCourse}</p>
                </div>
              </div>


              {/* LASAK EDU contact */}
              <div className="bg-slate-900 rounded-2xl p-4 mb-5 text-white text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center font-black text-xs">L</div>
                  <span className="font-black tracking-wide">LASAK EDU</span>
                </div>
                <p className="text-slate-400 text-xs">Our counsellor will contact you at <span className="text-white font-bold">{form.mobile}</span></p>
              </div>

              {/* ── PLACED STUDENTS BANNERS ── */}
              <div className="mb-5">
                <div className="flex items-center justify-center mb-4 mt-2">
                  <div className="bg-gradient-to-r from-yellow-400 to-amber-500 border border-yellow-300 rounded-full px-6 py-2.5 flex items-center gap-2 shadow-lg shadow-amber-100/40">
                    <span className="text-base sm:text-lg">🎓</span>
                    <span className="text-xs sm:text-sm md:text-base font-black uppercase tracking-wider text-amber-950">
                      Our Placed Students — You could be next!
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  {TESTIMONIALS.slice(0, 6).map((student) => (
                    <div
                      key={student.id}
                      className="bg-gradient-to-br from-blue-600 to-indigo-700 p-1.5 sm:p-2 rounded-2xl shadow-md border border-blue-500 hover:shadow-xl transition-all hover:scale-[1.03] flex flex-col justify-center"
                    >
                      <img
                        src={student.image}
                        alt={student.name}
                        className="w-full h-auto aspect-square object-cover rounded-xl border border-white/20"
                        onError={e => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=2563eb&color=fff&size=128`;
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-black text-base hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EligibilityModal;
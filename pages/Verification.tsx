import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Award, Search, ShieldCheck, FileText, HelpCircle, PhoneCall, ChevronDown } from 'lucide-react';
import type { CertificateData } from '../types';
import SEO from '../components/SEO';
import { fetchWithCache } from '../lib/cacheUtils';
import { normalizeImagePath } from '../lib/imageUtils';
import { CERTIFICATES } from '../constants/certificates';

// Format: TN/CBE/069/LTIEC0119
const CERT_ID_REGEX = /^[A-Z]{2}\/[A-Z]{3}\/\d{3}\/[A-Z]+\d{1,}$/;
const CERT_ID_PLACEHOLDER = 'e.g. TN/CBE/069/LTIEC0119';

const Verification = () => {
  const [certId, setCertId] = useState('');
  const [result, setResult] = useState<CertificateData | null>(null);
  const [error, setError] = useState(false);
  const [formatError, setFormatError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Content states — initialized with fallback data so sections always show
  const [howItWorksSteps, setHowItWorksSteps] = useState<any[]>([
    { icon_name: 'Search', icon_color: 'blue-600', title: 'Find Your ID', description: 'Locate the unique Certificate Identification number printed at the bottom of your certificate.' },
    { icon_name: 'FileText', icon_color: 'purple-600', title: 'Enter Details', description: "Type the ID carefully into the secure search bar above and click 'Verify Now'." },
    { icon_name: 'ShieldCheck', icon_color: 'green-600', title: 'Instant Validation', description: 'Our system matches your ID against our secure encrypted database for instant results.' }
  ]);
  const [credentialsSection, setCredentialsSection] = useState<any>({
    heading: 'Locate Your Credentials',
    description: 'Your official LasakEdu certificate contains a unique identification number. Use this number for verification during job applications or higher education processing.',
    bullet_point_1: 'Tamper-proof digital records',
    bullet_point_2: 'Recognized by top placement partners',
    bullet_point_3: 'Instant cloud-based validation',
    image_url: '/img/course-template.png'
  });
  const [faqs, setFaqs] = useState<any[]>([
    { question: 'Where can I find my Certificate ID?', answer: 'The ID is located at the bottom-right corner of your physical or digital certificate issued by LasakEdu.' },
    { question: 'What should I do if my ID is not found?', answer: "Please ensure you have entered the ID exactly as it appears. If it still doesn't show up, contact our support team at info@lasakedu.in." },
    { question: 'Is this verification valid for life?', answer: 'Yes, once a certificate is issued and recorded in our database, it remains available for verification indefinitely.' },
    { question: 'Can employers verify multiple certificates at once?', answer: 'Employers can use this portal to verify certificates individually. For bulk verification, HR teams can contact us directly.' }
  ]);
  const [supportSection, setSupportSection] = useState<any>({
    heading: 'Still Having Trouble?',
    description: 'Our academic support team is here to help you with any certificate-related issues or verification concerns.',
    button_1_text: 'Contact Support',
    button_1_link: 'mailto:info@lasakedu.in',
    button_2_text: 'Visit Office',
    button_2_link: '/contact'
  });

  const [lasakStandardSection, setLasakStandardSection] = useState<any>({
    heading: 'The Lasak Standard: Verification You Can Trust',
    subtitle: 'Integrity in Every Pixel. Authority in Every Hire.',
    intro_text: 'In an era of "instant certificates," Lasak Edu stands apart. We don\'t just issue documents; we validate expertise. Our certification process is a closed-loop, tamper-proof ecosystem designed to protect the hard work of our students and the hiring confidence of our partners.',
    feature_1_title: 'Zero Human Intervention',
    feature_1_desc: 'From the moment a student triggers their Admission Enrollment to the final Course Completion mark by our technical staff, the journey is 100% automated. No manual edits, no back-dating, no exceptions.',
    feature_2_title: 'Dual-Layer Authentication',
    feature_2_desc: 'Verification requires both the Admission Enrollment Number and the Certificate Number. This back-to-back validation ensures that every credential is tied to a legitimate, audited learning journey.',
    feature_3_title: 'ISO-Standard Rigor',
    feature_3_desc: 'We treat our certification audits with the same gravity as international ISO standards. Our digital signatures are permanent and non-tamperable.',
    footer_text: 'For Employers: When you see a Lasak Edu certificate, you aren\'t looking at a participation trophy. You are looking at a verified record of skill acquisition, backed by an automated system that eliminates human error and fraud.'
  });

  // Use the static certificates from constants.tsx directly
  const certificates = CERTIFICATES;

  // Fetch all page content from Firestore
  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        const { getFirestoreDb } = await import('../lib/firebase');
        const { collection, query, where, orderBy, limit } = await import('firebase/firestore');
        const db = await getFirestoreDb();
        // Fetch How it Works steps
        const stepsQ = query(
          collection(db, 'cert_how_it_works'),
          where('active', '==', true),
          orderBy('order_num', 'asc')
        );
        const stepsData = await fetchWithCache('cache_cert_steps', stepsQ);

        if (stepsData && stepsData.length > 0) {
          setHowItWorksSteps(stepsData);
        } else {
          // Fallback content
          setHowItWorksSteps([
            { icon_name: 'Search', icon_color: 'blue-600', title: 'Find Your ID', description: 'Locate the unique Certificate Identification number at the bottom of your certificate.' },
            { icon_name: 'FileText', icon_color: 'purple-600', title: 'Enter Details', description: 'Type the ID carefully into the secure search bar above and click \'Verify Now\'.' },
            { icon_name: 'ShieldCheck', icon_color: 'green-600', title: 'Instant Validation', description: 'Our system matches your ID against our secure encrypted database for instant results.' }
          ]);
        }

        // Fetch Credentials Section
        const credQ = query(collection(db, 'cert_credentials_section'), limit(1));
        const credData = await fetchWithCache('cache_cert_cred', credQ);

        if (credData && credData.length > 0) {
          setCredentialsSection(credData[0]);
        } else {
          // Fallback content
          setCredentialsSection({
            heading: 'Locate Your Credentials',
            description: 'Your official LasakEdu certificate contains a unique identification number. Use this number for verification during job applications or higher education processing.',
            bullet_point_1: 'Tamper-proof digital records',
            bullet_point_2: 'Recognized by top placement partners',
            bullet_point_3: 'Instant cloud-based validation',
            image_url: '/img/course-template.png'
          });
        }

        // Fetch FAQs
        const faqsQ = query(
          collection(db, 'cert_faqs'),
          where('active', '==', true),
          orderBy('order_num', 'asc')
        );
        const faqsData = await fetchWithCache('cache_cert_faqs', faqsQ);

        if (faqsData && faqsData.length > 0) {
          setFaqs(faqsData);
        } else {
          // Fallback content
          setFaqs([
            { question: 'Where can I find my Certificate ID?', answer: 'The ID is located at the bottom-right corner of your physical or digital certificate issued by LasakEdu.' },
            { question: 'What should I do if my ID is not found?', answer: 'Please ensure you have entered the ID exactly as it appears. If it still doesn\'t show up, contact our support team at info@lasakedu.in.' },
            { question: 'Is this verification valid for life?', answer: 'Yes, once a certificate is issued and recorded in our database, it remains available for verification indefinitely.' },
            { question: 'Can employers verify multiple certificates at once?', answer: 'Employers can use this portal to verify certificates individually. For bulk verification, HR teams can contact us directly.' }
          ]);
        }

        // Fetch Support Section
        const supportQ = query(collection(db, 'cert_support_section'), limit(1));
        const supportData = await fetchWithCache('cache_cert_support', supportQ);

        if (supportData && supportData.length > 0) {
          setSupportSection(supportData[0]);
        } else {
          // Fallback content
          setSupportSection({
            heading: 'Still Having Trouble?',
            description: 'Our academic support team is here to help you with any certificate-related issues or verification concerns.',
            button_1_text: 'Contact Support',
            button_1_link: 'mailto:info@lasakedu.in',
            button_2_text: 'Visit Office',
            button_2_link: '/contact'
          });
        }
        // Fetch Lasak Standard Section
        const lasakStandardQ = query(collection(db, 'cert_lasak_standard_section'), limit(1));
        const lasakStandardData = await fetchWithCache('cache_cert_lasak', lasakStandardQ);

        if (lasakStandardData && lasakStandardData.length > 0) {
          setLasakStandardSection(lasakStandardData[0]);
        }

      } catch (error) {
        console.error('Error fetching page content:', error);
        // Fallbacks already set in initial state — nothing to do here
      }
    };

    fetchPageContent();
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetId = certId.trim().toUpperCase();
    if (!targetId) return;

    // Validate format
    if (!CERT_ID_REGEX.test(targetId)) {
      setFormatError(true);
      setError(false);
      setResult(null);
      return;
    }

    setFormatError(false);
    setLoading(true);
    setResult(null);
    setError(false);

    try {
      const { getFirestoreDb } = await import('../lib/firebase');
      const { collection, query, where, getDocs } = await import('firebase/firestore');
      const db = await getFirestoreDb();

      // Query by the cert_id FIELD (not document ID) — handles IDs with slashes and any format
      const q = query(
        collection(db, 'certificates'),
        where('cert_id', '==', targetId)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setResult({
          certId: data.cert_id || targetId,
          studentName: data.student_name || data.studentName,
          courseName: data.course_name || data.courseName,
          duration: data.duration,
          completionDate: data.completion_date || data.completionDate || '',
          status: data.status as any
        });
      } else {
        // Try case-insensitive: fetch all and compare
        const allQ = query(collection(db, 'certificates'));
        const allSnap = await getDocs(allQ);
        const lowerTarget = targetId.toLowerCase();
        const match = allSnap.docs.find(d => {
          const cid = d.data().cert_id || '';
          return cid.toLowerCase() === lowerTarget;
        });

        if (match) {
          const data = match.data();
          setResult({
            certId: data.cert_id || targetId,
            studentName: data.student_name || data.studentName,
            courseName: data.course_name || data.courseName,
            duration: data.duration,
            completionDate: data.completion_date || data.completionDate || '',
            status: data.status as any
          });
        } else {
          // Fallback to static constants
          const found = certificates.find(c => c.certId.toLowerCase() === lowerTarget);
          if (found) {
            setResult(found);
          } else {
            setError(true);
          }
        }
      }
    } catch (err) {
      console.error('Error verifying certificate:', err);
      // On error, try static fallback
      const found = certificates.find(c => c.certId.toLowerCase() === targetId.toLowerCase());
      if (found) {
        setResult(found);
      } else {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center px-4 relative">
      <SEO
        title="LasakEdu Institute Coimbatore"
        description="Verify student certificates and internship records issued by LasakEdu Institute Coimbatore."
        keywords="certificate verification, internship certificate verification, LasakEdu verification, student certificate check"
        url="https://lasakedu.in/verification"
      />

      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100 rounded-full blur-[120px] opacity-40" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-100 rounded-full blur-[120px] opacity-40" />
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-bold border border-blue-100 mb-6"
          >
            <ShieldCheck size={16} /> Official Verification Portal
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">Verify Your Credentials</h1>
          <p className="text-slate-500 max-w-xl mx-auto text-base md:text-lg">
            Enter your unique Certification Number to instantly validate the authenticity of your LasakEdu records.
          </p>
        </div>

        {/* Verification Form */}
        <div className="max-w-2xl mx-auto mb-20">
          <form onSubmit={handleVerify} className="relative group">
            <div className="absolute inset-0 bg-blue-600/5 blur-xl group-focus-within:bg-blue-600/10 transition-colors rounded-full" />
            <div className="relative">
              <input
                type="text"
                value={certId}
                onChange={(e) => {
                  setCertId(e.target.value.toUpperCase());
                  setFormatError(false);
                  setError(false);
                  setResult(null);
                }}
                placeholder={CERT_ID_PLACEHOLDER}
                className={`w-full bg-white border-2 rounded-full py-4 md:py-6 px-6 md:px-10 text-base md:text-xl shadow-2xl focus:ring-0 outline-none transition-all placeholder:text-slate-300 font-mono ${
                  formatError ? 'border-red-400 focus:border-red-500' : 'border-slate-100 focus:border-blue-500'
                }`}
              />
              <button
                type="submit"
                disabled={loading}
                className="relative mt-4 w-full md:absolute md:mt-0 md:right-3 md:top-3 md:bottom-3 md:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-full py-4 md:py-0 px-10 font-black text-lg shadow-lg hover:shadow-blue-500/25 transition-all active:scale-95 disabled:bg-slate-400"
              >
                {loading ? 'Checking...' : 'Verify Now'}
              </button>
            </div>
          </form>

          {/* Format hint */}
          <p className="text-center text-xs text-slate-400 mt-3 font-mono tracking-wide">
            Format: <span className="text-blue-500 font-semibold">TN/CBE/069/LTIEC0119</span>
          </p>

          {/* Result Area */}
          <div className="mt-6 min-h-[100px]">
            {formatError && (
              <div
                className="bg-orange-50 border border-orange-200 text-orange-700 p-5 rounded-2xl flex items-center gap-3 shadow"
              >
                <AlertCircle className="shrink-0" size={22} />
                <div>
                  <p className="font-bold">Invalid Certificate ID Format</p>
                  <p className="text-sm mt-0.5">Please enter in the format: <span className="font-mono font-bold">TN/CBE/069/LTIEC0119</span></p>
                </div>
              </div>
            )}

            {error && (
              <div
                className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-2xl flex items-center justify-center gap-3 shadow-lg"
              >
                <AlertCircle className="shrink-0" />
                <span className="font-semibold">Record not found. Please double-check the Certificate ID.</span>
              </div>
            )}

            {result && (
              <div
                className="bg-white p-8 md:p-12 rounded-[2rem] shadow-2xl border-t-8 border-green-500 text-left relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Award size={150} />
                </div>

                <div className="flex items-center gap-6 mb-10 border-b border-slate-50 pb-8">
                  <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center">
                    <CheckCircle className="text-green-600" size={40} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900">Valid Credential</h2>
                    <p className="text-green-600 font-bold tracking-wide uppercase text-xs">Digitally Verified Record</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-slate-600 tracking-widest">Student Name</label>
                    <p className="text-xl font-bold text-slate-800">{result.studentName}</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-slate-600 tracking-widest">Certificate Number</label>
                    <p className="text-xl font-mono font-bold text-blue-600">{result.certId}</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-slate-600 tracking-widest">Program / Course</label>
                    <p className="text-lg font-semibold text-slate-700">{result.courseName}</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-slate-600 tracking-widest">Verification Status</label>
                    <div>
                      <span className="inline-flex px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-black border border-green-100">
                        {result.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-slate-600 tracking-widest">Duration</label>
                    <p className="text-slate-600 font-medium">{result.duration}</p>
                  </div>

                  {result.completionDate && (
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-black text-slate-600 tracking-widest">Date of Issue</label>
                      <p className="text-slate-600 font-medium">{result.completionDate}</p>
                    </div>
                  )}
                </div>

                <div className="mt-12 flex items-center justify-between pt-8 border-t border-slate-50 text-slate-600">
                  <div className="text-xs italic font-medium">Verify again at: lasakedu.in/verify</div>
                  <Award size={40} className="text-yellow-400 opacity-20" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Informative Sections */}
        <div className="space-y-32 mb-24">

          {/* How it Works */}
          <section>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-slate-900 mb-4">How it Works</h2>
              <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {howItWorksSteps.map((step, i) => {
                const iconMap: any = {
                  'Search': <Search className={`text-${step.icon_color}`} />,
                  'FileText': <FileText className={`text-${step.icon_color}`} />,
                  'ShieldCheck': <ShieldCheck className={`text-${step.icon_color}`} />,
                  'Award': <Award className={`text-${step.icon_color}`} />,
                  'CheckCircle': <CheckCircle className={`text-${step.icon_color}`} />,
                  'AlertCircle': <AlertCircle className={`text-${step.icon_color}`} />
                };
                const icon = iconMap[step.icon_name] || <Search className="text-blue-600" />;

                return (
                  <div key={i} className="text-center p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      {icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Certificate Mockup Visualization */}
          <section className="bg-slate-900 rounded-[2rem] md:rounded-[3rem] p-8 md:p-20 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[100px]"></div>
            <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
              <div className="lg:w-1/2">
                <h2 className="text-4xl font-black mb-8">{credentialsSection?.heading || 'Locate Your Credentials'}</h2>
                <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                  {credentialsSection?.description || 'Your official LasakEdu certificate contains a unique identification number. Use this number for verification during job applications or higher education processing.'}
                </p>
                <ul className="space-y-4">
                  {credentialsSection && [
                    credentialsSection.bullet_point_1,
                    credentialsSection.bullet_point_2,
                    credentialsSection.bullet_point_3
                  ].filter(Boolean).map((item, i) => (
                    <li key={i} className="flex items-center gap-3 font-bold">
                      <CheckCircle className="text-cyan-400" size={20} /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:w-1/2">
                <div
                  className="bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-sm"
                >
                  <img
                    src={normalizeImagePath(credentialsSection?.image_url || '/img/course-template.png')}
                    alt="Sample Certificate"
                    className="rounded-2xl shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Lasak Standard Section */}
          <section className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-slate-900 mb-4">{lasakStandardSection.heading}</h2>
              <p className="text-xl text-blue-600 font-bold mb-6">{lasakStandardSection.subtitle}</p>
              <p className="text-slate-600 leading-relaxed max-w-3xl mx-auto">
                {lasakStandardSection.intro_text}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-0"></div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 relative z-10">
                  <span className="text-xl font-black text-blue-600">01</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 relative z-10">{lasakStandardSection.feature_1_title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed relative z-10">{lasakStandardSection.feature_1_desc}</p>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -z-0"></div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6 relative z-10">
                  <span className="text-xl font-black text-purple-600">02</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 relative z-10">{lasakStandardSection.feature_2_title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed relative z-10">{lasakStandardSection.feature_2_desc}</p>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -z-0"></div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6 relative z-10">
                  <span className="text-xl font-black text-green-600">03</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 relative z-10">{lasakStandardSection.feature_3_title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed relative z-10">{lasakStandardSection.feature_3_desc}</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-6 md:p-8 rounded-2xl text-center">
              <p className="text-slate-700 font-medium italic">
                {lasakStandardSection.footer_text}
              </p>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-slate-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-slate-500">Everything you need to know about our certification process.</p>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <details key={i} className="group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all hover:border-blue-200">
                  <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-800 list-none">
                    {faq.question}
                    <ChevronDown className="group-open:rotate-180 transition-transform text-slate-600" size={20} />
                  </summary>
                  <div className="px-6 pb-6 text-slate-500 text-sm leading-relaxed border-t border-slate-50 pt-4">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-12 text-center text-white shadow-2xl">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <PhoneCall size={32} />
            </div>
            <h2 className="text-3xl font-black mb-4">{supportSection?.heading || 'Still Having Trouble?'}</h2>
            <p className="text-blue-100 mb-8 max-w-lg mx-auto">{supportSection?.description || 'Our academic support team is here to help you with any certificate-related issues or verification concerns.'}</p>
            <div className="flex flex-wrap justify-center gap-4 text-xs">
              <a href={supportSection?.button_1_link || 'mailto:info@lasakedu.in'} className="bg-white text-blue-600 px-8 py-4 rounded-full font-black hover:bg-blue-50 transition-colors">{supportSection?.button_1_text || 'Contact Support'}</a>
              <a href={supportSection?.button_2_link || '/contact'} className="bg-blue-800/30 text-white px-8 py-4 rounded-full font-black border border-white/10 hover:bg-blue-800/40 transition-colors">{supportSection?.button_2_text || 'Visit Office'}</a>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Verification;

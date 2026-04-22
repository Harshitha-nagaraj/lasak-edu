import React, { useEffect, useState } from "react";
import { Mail, Phone, MapPin, ArrowRight, CheckCircle } from "lucide-react";
import { fetchWithCache } from "../lib/cacheUtils";
import SEO from "../components/SEO";

const Contact = () => {
  const [contactInfo, setContactInfo] = useState<any[]>([]);
  const [formSettings, setFormSettings] = useState({
    url: 'https://script.google.com/macros/s/AKfycbyCXeBcecLMxEqsI895ypcAgNwa0v4obpE6lXMczvDolz3kaMRPf6aDxmTH9vEL5FzKsw/exec',
    title: 'Submit Your Details',
    departments: ['Mechanical', 'Civil', 'CSE', 'IT', 'ECE', 'Others']
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [pageSettings, setPageSettings] = useState({
    heroTitle: 'Get In Touch',
    heroSubtitle: "We'd love to hear from you. Visit our branches or drop us a message.",
    formTitle: 'Send Us a Message',
    formSubtitle: 'Have questions about our courses or placements? Reach out to us and our team will get back to you within 24 hours.'
  });

  useEffect(() => {
    fetchContactInfo();
    fetchFormSettings();
    fetchPageSettings();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const { getFirestoreDb } = await import('../lib/firebase');
      const { collection, query, where } = await import('firebase/firestore');
      const db = await getFirestoreDb();
      // Simplified query to avoid index requirement for orderBy
      const q = query(
        collection(db, 'contact_info'),
        where('active', '==', true)
      );
      const data = await fetchWithCache('cache_contact_info', q);
      if (data && data.length > 0) {
        const sortedData = data
          .sort((a: any, b: any) => (a.order_num || 0) - (b.order_num || 0));

        const displayContacts = sortedData.filter((c: any) => ['address', 'phone', 'email'].includes(c.type));
        setContactInfo(displayContacts);
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
    }
  };

  const fetchFormSettings = async () => {
    try {
      const { getFirestoreDb } = await import('../lib/firebase');
      const { doc, getDoc } = await import('firebase/firestore');
      const db = await getFirestoreDb();
      const docRef = doc(db, 'site_settings', 'contact_form_settings');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.value) {
          setFormSettings(data.value);
        } else {
          // If the structure is directly as the value
          setFormSettings(data as any);
        }
      }
    } catch (error) {
      console.error("Error fetching form settings:", error);
    }
  };

  const fetchPageSettings = async () => {
    try {
      const { getFirestoreDb } = await import('../lib/firebase');
      const { doc, getDoc } = await import('firebase/firestore');
      const db = await getFirestoreDb();
      const docRef = doc(db, 'site_settings', 'contact_page_content');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data().value) {
        setPageSettings(docSnap.data().value);
      }
    } catch (error) {
      console.error("Error fetching page settings:", error);
    }
  };

  const getIcon = (iconName: string) => {
    if (iconName === 'MapPin') return <MapPin size={24} />;
    if (iconName === 'Phone') return <Phone size={24} />;
    if (iconName === 'Mail') return <Mail size={24} />;
    return <MapPin size={24} />;
  };

  // Fallback if DB is empty
  const defaultContacts = [
    { id: '1', type: 'address', label: 'Head Office', value: "11A, STV Nagar, Peelamedu, Nava India Signal, Coimbatore - 641004", icon: 'MapPin' },
    { id: '3', type: 'phone', label: 'Phone Number', value: "+91 7418 734 466", icon: 'Phone' },
    { id: '4', type: 'email', label: 'Email Address', value: "info@lasakedu.in", icon: 'Mail' },
    { id: '2', type: 'address', label: 'Branch Office', value: "No.655 F Shri Paaththaa avenue 1st floor above Cheran tarpaulin Near Gp signal Gandhipuram -12", icon: 'MapPin' },
    { id: '5', type: 'phone', label: 'Phone Number', value: "+91 74187 32525", icon: 'Phone' },
    { id: '6', type: 'email', label: 'Email Address', value: "info@lasakedu.in", icon: 'Mail' }
  ];

  const displayData = contactInfo.length > 0 ? contactInfo : defaultContacts;

  // Group contacts by branch (address entry starts a group)
  // Fixed display names so headings don't flicker when Firestore data loads
  const branchDisplayNames = ['Head Office', 'Branch Office'];
  const groupBranches = (data: any[]) => {
    const branches: any[] = [];
    let currentBranch: any = null;

    data.forEach(item => {
      if (item.type === 'address') {
        currentBranch = {
          id: item.id,
          name: branchDisplayNames[branches.length] || item.label,
          address: item.value,
          directionsUrl: item.directions_url, // Custom directions URL from database
          contacts: []
        };
        branches.push(currentBranch);
      } else if (currentBranch) {
        currentBranch.contacts.push(item);
      } else {
        // Fallback for items before any address
        if (branches.length === 0) {
          currentBranch = { id: 'default', name: 'Head Office', address: '', directionsUrl: null, contacts: [] };
          branches.push(currentBranch);
        }
        currentBranch.contacts.push(item);
      }
    });

    return branches;
  };

  const branches = groupBranches(displayData);

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden pb-20">
      <SEO
        title="Contact LasakEdu Institute Coimbatore"
        description="Get in touch with LasakEdu Institute for admissions and course details. Visit our Coimbatore branches or call us today."
        keywords="LasakEdu contact, education institute contact, training institute address, Coimbatore branches"
        url="https://lasakedu.in/contact"
      />

      {/* Hero */}
      <div className="h-[40vh] bg-white flex items-center justify-center border-b border-slate-200">
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-black mb-4 text-slate-900 px-4">
            {pageSettings.heroTitle}
          </h1>
          <p className="text-slate-500 text-lg">
            {pageSettings.heroSubtitle}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-20">
        <div className="flex flex-col gap-12">

          {/* Branch Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {branches.map((branch, branchIdx) => (
              <div key={branch.id || branchIdx} className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 border border-slate-200 shadow-2xl hover:shadow-blue-600/5 transition-all duration-500 group">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                    <MapPin size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 leading-tight">
                      {branch.name}
                    </h2>
                    <div className="h-1 w-12 bg-blue-600 rounded-full mt-2" />
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Address Section */}
                  {branch.address && (
                    <div className="flex gap-6">
                      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 shrink-0">
                        <MapPin size={22} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-600 uppercase tracking-widest mb-2">Location</p>
                        <p className="text-slate-700 font-medium leading-relaxed">
                          {branch.address}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Grouped Contacts (Phone/Email) */}
                  <div className="grid grid-cols-1 gap-8 pt-4 border-t border-slate-100">
                    {branch.contacts.map((contact: any, idx: number) => (
                      <div key={idx} className="flex gap-6">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${contact.type === 'phone' ? 'bg-green-50 text-green-600' :
                          contact.type === 'email' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                          }`}>
                          {contact.type === 'phone' ? <Phone size={22} /> :
                            contact.type === 'email' ? <Mail size={22} /> :
                              <MapPin size={22} />}
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">{contact.label}</p>
                          <a
                            href={contact.type === 'phone' ? `tel:${contact.value.replace(/\s+/g, '')}` :
                              contact.type === 'email' ? `mailto:${contact.value}` : '#'}
                            className="text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors"
                          >
                            {contact.value}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-10">
                  <a
                    href={branch.directionsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.name + ' ' + branch.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 font-black text-sm uppercase tracking-tighter hover:gap-3 transition-all"
                  >
                    Get Directions <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* FORM */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-slate-900 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl border border-slate-800">
            <div className="lg:col-span-4 p-8 md:p-12 bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight">
                {pageSettings.formTitle}
              </h2>
              <p className="text-blue-100/80 text-base md:text-lg mb-8 leading-relaxed whitespace-pre-line">
                {pageSettings.formSubtitle}
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold">Expert Guidance</h4>
                    <p className="text-sm text-blue-100/60">Professional counseling</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 p-8 md:p-12">
              <h3 className="text-2xl font-bold mb-8 text-white">{formSettings.title}</h3>

              <form
                className="space-y-6"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (isSubmitting) return;

                    setIsSubmitting(true);
                    const form = e.target as HTMLFormElement;
                    const formData = new FormData(form);

                    // Convert FormData to object for Firestore
                    const submission = {
                      full_name: formData.get('fullName'),
                      qualification: formData.get('qualification'),
                      phone: formData.get('phone'),
                      email: formData.get('email'),
                      message: formData.get('address'), // Using address field as message for now
                      department: formData.get('department'),
                      status: formData.get('status'),
                      branch: formData.get('branch'),
                      source: formData.get('applyFrom')
                    };

                    try {
                      const { getFirestoreDb } = await import('../lib/firebase');
                      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
                      const db = await getFirestoreDb();
                      // 1. Save to Firestore (Database)
                      const enquiryData = {
                        ...submission,
                        created_at: serverTimestamp(),
                        updated_at: serverTimestamp()
                      };
                      await addDoc(collection(db, 'enquiries'), enquiryData);

                    // 2. Send to Google Sheets (External)
                    const sheetsData = {
                      fullName: submission.full_name,
                      qualification: submission.qualification,
                      phone: submission.phone,
                      email: submission.email,
                      department: submission.department,
                      status: submission.status,
                      preferredBranch: submission.branch,
                      course: "Contact Page"
                    };

                    fetch(formSettings.url, {
                      method: "POST",
                      mode: 'no-cors',
                      body: JSON.stringify(sheetsData),
                    }).catch(err => console.error("Google Sheets Error:", err));

                      alert("Enquiry Submitted Successfully! We will contact you soon.");
                      form.reset();
                    } catch (error: any) {
                      console.error(error);
                      alert("Submission error. Please try again or contact us directly.");
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
              >
                <input name="fullName" placeholder="Full Name" required className="w-full p-3 rounded bg-slate-800 border border-white/20 text-white placeholder:text-slate-600 focus:border-cyan-400 outline-none" />
                <input name="qualification" placeholder="Qualification" required className="w-full p-3 rounded bg-slate-800 border border-white/20 text-white placeholder:text-slate-600 focus:border-cyan-400 outline-none" />
                <input name="phone" placeholder="Phone Number" required className="w-full p-3 rounded bg-slate-800 border border-white/20 text-white placeholder:text-slate-600 focus:border-cyan-400 outline-none" />
                <input name="email" type="email" placeholder="Email" required className="w-full p-3 rounded bg-slate-800 border border-white/20 text-white placeholder:text-slate-600 focus:border-cyan-400 outline-none" />
                <textarea name="address" placeholder="Address" required className="w-full p-3 rounded bg-slate-800 border border-white/20 text-white placeholder:text-slate-600 focus:border-cyan-400 outline-none" />

                <select name="branch" required className="w-full p-3 rounded bg-slate-800 border border-white/20 text-white focus:border-cyan-400 outline-none">
                  <option value="" className="bg-slate-900">Select Branch</option>
                  <option value="Peelamedu" className="bg-slate-900">Peelamedu</option>
                  <option value="Gandhipuram" className="bg-slate-900">Gandhipuram</option>
                </select>

                <select name="department" required className="w-full p-3 rounded bg-slate-800 border border-white/20 text-white focus:border-cyan-400 outline-none">
                  <option value="" className="bg-slate-900">Select Department</option>
                  {/* Dynamic Departments */}
                  {formSettings.departments.map((dept: string, i: number) => (
                    <option key={i} value={dept} className="bg-slate-900">{dept}</option>
                  ))}
                </select>

                <select name="status" required className="w-full p-3 rounded bg-slate-800 border border-white/20 text-white focus:border-cyan-400 outline-none">
                  <option value="" className="bg-slate-900">Current Status</option>
                  <option value="Student" className="bg-slate-900">Student</option>
                  <option value="Working Professional" className="bg-slate-900">Working Professional</option>
                  <option value="Fresher" className="bg-slate-900">Fresher</option>
                </select>

                <select name="applyFrom" required className="w-full p-3 rounded bg-slate-800 border border-white/20 text-white focus:border-cyan-400 outline-none">
                  <option value="" className="bg-slate-900">Applying From</option>
                  <option value="Instagram" className="bg-slate-900">Instagram</option>
                  <option value="Facebook" className="bg-slate-900">Facebook</option>
                  <option value="Google" className="bg-slate-900">Google</option>
                  <option value="Friends" className="bg-slate-900">Friends</option>
                </select>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full font-bold py-3 rounded transition-all flex items-center justify-center gap-2 ${isSubmitting ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-cyan-400 text-black hover:bg-cyan-300 shadow-lg shadow-cyan-400/20'
                    }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    'Submit Details'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section - Instant Load */}
        <div className="mt-20 h-[500px] w-full rounded-[2.5rem] overflow-hidden border border-slate-200 relative bg-slate-100 shadow-2xl">
          <iframe
            title="LasakEdu Institute Location Map - Coimbatore"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3914.5808205968732!2d76.9907446!3d11.0218845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba85900902f4b99%3A0xa1463256c1a69adb!2sLASAK%20EDU!5e0!3m2!1sen!2sin!4v1711345678901"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="eager"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full grayscale-[20%] hover:grayscale-0 transition-all duration-700"
          />
        </div>

      </div>
    </div>
  );
};

export default Contact;

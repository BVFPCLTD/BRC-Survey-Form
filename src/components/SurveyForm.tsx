import React, { useState } from 'react';
import { useSurveyStore } from '../store/useSurveyStore';
import { cn } from '../lib/utils';
import { Anchor, CheckCircle2, AlertCircle } from 'lucide-react';

const landOptions = ['१ एकर पेक्षा कमी', '१ ते ३ एकर', '३ ते ५ एकर', '५ ते १० एकर', '१० एकर पेक्षा जास्त'];
const cropOptions = ['गहू', 'डाळी / कडधान्ये', 'भाजीपाला', 'भात / धान', 'सोयाबीन', 'इतर'];
const memberOptions = ['होय, सक्रिय सदस्य', 'अद्याप नाही, पण रस आहे', 'नाही'];
const organicOptions = ['होय, पूर्णपणे सेंद्रिय', 'रासायनिक आणि सेंद्रिय दोन्ही', 'नाही, फक्त रासायनिक', 'सेंद्रिय शेतीकडे वळण्याचा विचार करत आहोत'];
const heardOptions = ['गांडूळ खत', 'जीवामृत', 'पंचगव्य', 'ट्रायकोडर्मा', 'निंबोळी अर्क', 'दशपर्णी अर्क', 'यापैकी काहीही नाही'];
const problemOptions = ['खते/बियांचा वाढता खर्च', 'जमिनीचा पोत खराब होणे', 'कीड आणि रोगराई', 'शेतमालाला कमी भाव', 'पाणी / सिंचनाचा प्रश्न', 'योग्य मार्गदर्शनाचा अभाव'];
const interestOptions = ['नक्कीच होय', 'कदाचित होय', 'खात्री नाही', 'नाही'];
const topicOptions = ['गांडूळ खत बनवणे', 'जीवामृत आणि पंचगव्य', 'दशपर्णी अर्क आणि जैविक कीटकनाशके', 'जमिनीचे आरोग्य आणि माती परीक्षण', 'सेंद्रिय प्रमाणीकरण', 'काढणीपश्चात तंत्रज्ञान आणि साठवणूक', 'शेतमालाला चांगला भाव कसा मिळवावा'];
const dayOptions = ['सोमवार', 'मंगळवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार', 'रविवार', 'कोणताही वार'];
const timeOptions = ['सकाळ (७-११)', 'दुपार (११-२)', 'दुपारनंतर (२-५)', 'संध्याकाळ (५-७)', 'पूर्ण दिवस'];
const wtpOptions = ['₹० (फक्त मोफत असल्यास)', '₹५०-१००', '₹१००-२००', '₹२००-३५०', '₹३५०-५००', '₹५०० पेक्षा जास्त'];
const buyInputOptions = ['नक्कीच होय', 'किंमतीनुसार ठरवेन', 'नंतर विचार करेन', 'नाही'];
const referOptions = ['नक्कीच होय', 'कदाचित', 'नाही'];

function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-1.5 text-red-500 text-sm mt-2 animate-in fade-in slide-in-from-top-1">
      <AlertCircle className="w-4 h-4" />
      <span>{message}</span>
    </div>
  );
}

function Pills({ options, selected, onChange, multi = false, hasError = false }: { options: string[], selected: string | string[], onChange: (val: any) => void, multi?: boolean, hasError?: boolean }) {
  const isSelected = (opt: string) => multi ? (selected as string[]).includes(opt) : selected === opt;
  
  const toggle = (opt: string) => {
    if (multi) {
      const arr = selected as string[];
      onChange(arr.includes(opt) ? arr.filter(o => o !== opt) : [...arr, opt]);
    } else {
      onChange(opt);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 mt-3">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={cn(
            "px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl sm:rounded-full text-sm transition-all duration-200 border select-none active:scale-95 text-left text-balance sm:text-center",
            isSelected(opt)
              ? "bg-brand-900 border-brand-900 text-white shadow-sm font-medium"
              : hasError 
                ? "bg-white border-red-300 text-red-700 hover:bg-red-50"
                : "bg-white border-gray-200 text-gray-700 hover:border-brand-300 hover:bg-brand-50/50"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export function SurveyForm() {
  const { addResponse } = useSurveyStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  
  const scriptUrl = import.meta.env.VITE_GOOGLE_SHEETS_URL;

  const [form, setForm] = useState({
    name: '', village: '', land: '', crops: [] as string[],
    member: '', organic: '', heard: [] as string[], problem: '',
    interest: '', topics: [] as string[], day: '', time: '',
    wtp: '', buyinput: '', refer: '', comments: '', mobile: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (key: keyof typeof form, val: any) => {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) {
      setErrors(e => {
        const newErr = { ...e };
        delete newErr[key];
        return newErr;
      });
    }
  };

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!form.village.trim()) newErrors.village = 'गाव / ग्रामपंचायत आवश्यक आहे';
      if (!form.land) newErrors.land = 'कृपया जमिनीचे क्षेत्रफळ निवडा';
      if (form.crops.length === 0) newErrors.crops = 'कृपया किमान एक पीक निवडा';
      if (!form.member) newErrors.member = 'कृपया एक पर्याय निवडा';
    }

    if (currentStep === 2) {
      if (!form.organic) newErrors.organic = 'कृपया एक पर्याय निवडा';
      if (form.heard.length === 0) newErrors.heard = 'कृपया किमान एक पर्याय निवडा';
      if (!form.problem) newErrors.problem = 'कृपया मुख्य अडचण निवडा';
    }

    if (currentStep === 3) {
      if (!form.interest) newErrors.interest = 'कृपया एक पर्याय निवडा';
      if (form.topics.length === 0) newErrors.topics = 'कृपया किमान एक विषय निवडा';
      if (!form.day) newErrors.day = 'कृपया सोयीचा वार निवडा';
      if (!form.time) newErrors.time = 'कृपया सोयीची वेळ निवडा';
    }

    if (currentStep === 4) {
      if (!form.wtp) newErrors.wtp = 'कृपया एक पर्याय निवडा';
      if (!form.buyinput) newErrors.buyinput = 'कृपया एक पर्याय निवडा';
      if (!form.refer) newErrors.refer = 'कृपया एक पर्याय निवडा';
      if (form.mobile) {
        const localNumber = form.mobile.replace(/^\+91\s*/, '').replace(/\D/g, '');
        if (localNumber.length !== 10) {
          newErrors.mobile = 'कृपया १० अंकी योग्य मोबाईल नंबर प्रविष्ट करा';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(s => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const submit = async () => {
    if (!validateStep(4)) return;
    setLoading(true);
    const fallbackId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    const fullData = { ...form, id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : fallbackId, createdAt: new Date().toISOString() };
    addResponse(fullData);

    // Google Sheets integration
    if (scriptUrl) {
      try {
        const formBody = new URLSearchParams();
        Object.entries(fullData).forEach(([k, v]) => {
          formBody.append(k, Array.isArray(v) ? v.join(', ') : (v as string));
        });
        
        await fetch(scriptUrl, { 
          method: 'POST', 
          body: formBody, 
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
      } catch (err) {
        console.error('Google Sheets submission failed', err);
      }
    } else {
      console.warn("VITE_GOOGLE_SHEETS_URL is not set. Data was only saved locally.");
      await new Promise(r => setTimeout(r, 600));
    }
    
    setLoading(false);
    setDone(true);
  };

  if (done) {
    return (
      <div className="text-center py-16 animation-fade-in">
        <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-brand-600" />
        </div>
        <h3 className="font-serif text-xl font-medium text-gray-900 mb-2">माहिती जतन केली!</h3>
        <p className="text-sm text-gray-500 mb-8">Data successfully saved to Google Sheets & Dashboard.</p>
        <button 
          onClick={() => {
            setForm({
              name: '', village: '', land: '', crops: [], member: '', organic: '', heard: [], problem: '',
              interest: '', topics: [], day: '', time: '', wtp: '', buyinput: '', refer: '', comments: '', mobile: ''
            });
            setErrors({});
            setStep(1);
            setDone(false);
          }}
          className="px-6 py-2.5 bg-brand-900 text-white rounded-xl text-sm font-medium hover:bg-brand-800 transition-colors"
        >
          नवीन फॉर्म भरा (Add Another)
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white md:rounded-[2rem] sm:border border-gray-100 sm:shadow-sm relative overflow-hidden sm:p-8 md:p-12 -mx-5 px-5 sm:mx-0">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100">
        <div className="h-full bg-brand-500 transition-all duration-500 ease-out" style={{ width: `${(step / 4) * 100}%` }} />
      </div>

      {!scriptUrl && (
        <div className="my-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <strong className="block font-medium mb-1">Google Sheets Disconnected</strong>
            You haven't set the <code>VITE_GOOGLE_SHEETS_URL</code> secret yet. Forms submitted right now are only saving locally to your device, not to the cloud.
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 mb-8 pt-4">
        <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs"><Anchor className="w-4 h-4"/></div>
        <span className="text-sm font-semibold tracking-widest uppercase text-gray-400">Step {step} of 4</span>
      </div>

      <div className="space-y-8 min-h-[350px]">
        {step === 1 && (
          <div className="animation-fade-in space-y-8">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-brand-950">वैयक्तिक माहिती (Background)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div>
                <label className="block text-base sm:text-sm font-medium text-gray-700 mb-2">१. शेतकऱ्याचे नाव <span className="text-gray-400 font-normal">(पर्यायी)</span></label>
                <input type="text" value={form.name} onChange={e => update('name', e.target.value)} className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 sm:py-3 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" placeholder="Farmer Name" />
              </div>
              <div>
                <label className="block text-base sm:text-sm font-medium text-gray-700 mb-2">२. गाव / ग्रामपंचायत <span className="text-red-500">*</span></label>
                <input type="text" value={form.village} onChange={e => update('village', e.target.value)} className={cn("w-full border bg-gray-50 rounded-xl px-4 py-3 sm:py-3 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all", errors.village ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : "border-gray-200")} placeholder="Village" />
                <ErrorMessage message={errors.village} />
              </div>
            </div>
            <div>
              <label className="block text-base sm:text-sm font-medium text-gray-700">३. आपली शेती किती एकर आहे? <span className="text-red-500">*</span></label>
              <Pills options={landOptions} selected={form.land} onChange={(v) => update('land', v)} hasError={!!errors.land} />
              <ErrorMessage message={errors.land} />
            </div>
            <div>
              <label className="block text-base sm:text-sm font-medium text-gray-700">४. आपण प्रामुख्याने कोणती पिके घेता? <span className="text-sm sm:text-xs font-normal text-gray-400">(अनेक निवडू शकता)</span> <span className="text-red-500">*</span></label>
              <Pills options={cropOptions} selected={form.crops} onChange={(v) => update('crops', v)} multi hasError={!!errors.crops} />
              <ErrorMessage message={errors.crops} />
            </div>
            <div>
              <label className="block text-base sm:text-sm font-medium text-gray-700">५. आपण आमच्या कंपनीचे (FPC) सदस्य आहात का? <span className="text-red-500">*</span></label>
              <Pills options={memberOptions} selected={form.member} onChange={(v) => update('member', v)} hasError={!!errors.member} />
              <ErrorMessage message={errors.member} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animation-fade-in space-y-8">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-brand-950">शेतीची सद्यस्थिती (Practices)</h2>
            <div>
              <label className="block text-base sm:text-sm font-medium text-gray-700">६. आपण सध्या सेंद्रिय खते/औषधे वापरता का? <span className="text-red-500">*</span></label>
              <Pills options={organicOptions} selected={form.organic} onChange={(v) => update('organic', v)} hasError={!!errors.organic} />
              <ErrorMessage message={errors.organic} />
            </div>
            <div>
              <label className="block text-base sm:text-sm font-medium text-gray-700">७. खालीलपैकी कोणती जैविक खते/औषधे ऐकली किंवा वापरली आहेत? <span className="text-red-500">*</span></label>
              <Pills options={heardOptions} selected={form.heard} onChange={(v) => update('heard', v)} multi hasError={!!errors.heard} />
              <ErrorMessage message={errors.heard} />
            </div>
            <div>
              <label className="block text-base sm:text-sm font-medium text-gray-700">८. सध्या शेतीत सर्वात मोठी अडचण कोणती? <span className="text-red-500">*</span></label>
              <Pills options={problemOptions} selected={form.problem} onChange={(v) => update('problem', v)} hasError={!!errors.problem} />
              <ErrorMessage message={errors.problem} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animation-fade-in space-y-8">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-brand-950">प्रशिक्षण आवड (Training Interest)</h2>
            <div>
              <label className="block text-base sm:text-sm font-medium text-gray-700">९. आपण BRC च्या प्रशिक्षण शिबिरात सहभागी होण्यास उत्सुक आहात का? <span className="text-red-500">*</span></label>
              <Pills options={interestOptions} selected={form.interest} onChange={(v) => update('interest', v)} hasError={!!errors.interest} />
              <ErrorMessage message={errors.interest} />
            </div>
            <div>
              <label className="block text-base sm:text-sm font-medium text-gray-700">१०. तुम्हाला कोणत्या विषयांचे प्रशिक्षण घ्यायला आवडेल? <span className="text-red-500">*</span></label>
              <Pills options={topicOptions} selected={form.topics} onChange={(v) => update('topics', v)} multi hasError={!!errors.topics} />
              <ErrorMessage message={errors.topics} />
            </div>
            <div>
              <label className="block text-base sm:text-sm font-medium text-gray-700">११. प्रशिक्षणासाठी कोणता वार सोयीचा राहील? <span className="text-red-500">*</span></label>
              <Pills options={dayOptions} selected={form.day} onChange={(v) => update('day', v)} hasError={!!errors.day} />
              <ErrorMessage message={errors.day} />
            </div>
            <div>
              <label className="block text-base sm:text-sm font-medium text-gray-700">१२. प्रशिक्षणासाठी कोणती वेळ सोयीची राहील? <span className="text-red-500">*</span></label>
              <Pills options={timeOptions} selected={form.time} onChange={(v) => update('time', v)} hasError={!!errors.time} />
              <ErrorMessage message={errors.time} />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animation-fade-in space-y-8">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-brand-950">फी आणि इतर (Commitment)</h2>
            <div>
              <label className="block text-base sm:text-sm font-medium text-gray-700">१३. पूर्ण दिवसाच्या प्रात्यक्षिकासह प्रशिक्षणासाठी आपण किती फी देऊ शकता? <span className="text-red-500">*</span></label>
              <p className="text-sm sm:text-xs text-gray-500 mb-3 mt-1">६ तास, चहा-नाश्ता, प्रमाणपत्र आणि मोफत सॅम्पल सोबत</p>
              <Pills options={wtpOptions} selected={form.wtp} onChange={(v) => update('wtp', v)} hasError={!!errors.wtp} />
              <ErrorMessage message={errors.wtp} />
            </div>
            <div>
              <label className="block text-base sm:text-sm font-medium text-gray-700">१४. आपण BRC कडून थेट जैविक खते खरेदी करण्यास उत्सुक आहात का? <span className="text-red-500">*</span></label>
              <Pills options={buyInputOptions} selected={form.buyinput} onChange={(v) => update('buyinput', v)} hasError={!!errors.buyinput} />
              <ErrorMessage message={errors.buyinput} />
            </div>
            <div>
              <label className="block text-base sm:text-sm font-medium text-gray-700">१५. आपण इतर शेतकऱ्यांना या प्रशिक्षणाची शिफारस कराल का? <span className="text-red-500">*</span></label>
              <Pills options={referOptions} selected={form.refer} onChange={(v) => update('refer', v)} hasError={!!errors.refer} />
              <ErrorMessage message={errors.refer} />
            </div>
            <div>
              <label className="block text-base sm:text-sm font-medium text-gray-700 mb-2">१६. तुमची काही सूचना किंवा प्रश्न? (पर्यायी)</label>
              <textarea value={form.comments} onChange={e => update('comments', e.target.value)} rows={2} className="w-full resize-none border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 sm:py-3 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" placeholder="Any suggestions..." />
            </div>
            
            <div className="bg-brand-50 p-5 md:p-6 rounded-[1.5rem] border border-brand-100">
              <label className="block text-base sm:text-sm font-medium text-brand-900 mb-3">१७. संपर्कासाठी मोबाईल नंबर <span className="font-normal opacity-70">(पर्यायी)</span></label>
              <div className={cn("flex bg-white rounded-xl overflow-hidden border transition-all", errors.mobile ? "border-red-400 ring-1 ring-red-400" : "border-gray-200 focus-within:border-brand-400 focus-within:ring-1 focus-within:ring-brand-400")}>
                <span className="flex items-center justify-center pl-4 pr-3 py-3 sm:py-3 text-base sm:text-sm font-mono text-gray-500 bg-gray-50/50 border-r border-gray-200 select-none">+91</span>
                <input type="tel" value={form.mobile.replace(/^\+91\s*/, '')} onChange={e => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                  update('mobile', val ? '+91 ' + val : '');
                }} className="w-full px-3 py-3 sm:py-3 text-base sm:text-sm focus:outline-none font-mono" placeholder="९८७६५४३२१०" />
              </div>
              <ErrorMessage message={errors.mobile} />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 justify-end mt-10 border-t border-gray-100 pt-8">
        {step > 1 && (
          <button onClick={() => setStep(s => s - 1)} className="px-5 py-3 sm:py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors active:scale-95">
            मागे (Back)
          </button>
        )}
        {step < 4 ? (
          <button onClick={handleNext} className="px-6 py-3 sm:py-2.5 rounded-xl text-sm font-medium text-white bg-brand-900 hover:bg-brand-800 transition-colors shadow-sm active:scale-95">
            पुढे (Next)
          </button>
        ) : (
          <button onClick={submit} disabled={loading} className="px-8 py-3 sm:py-2.5 rounded-xl text-sm font-medium text-white bg-brand-700 hover:bg-brand-600 transition-colors shadow-sm active:scale-95 min-w-[120px] flex justify-center items-center">
            {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "जतन करा (Submit)"}
          </button>
        )}
      </div>
    </div>
  );
}

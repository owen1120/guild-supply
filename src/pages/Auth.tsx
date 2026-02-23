import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Key, IdCard, Eye, EyeOff, Diamond, Radio, ChevronLeft, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';
import { authService } from '../features/auth/services/authService'; 

type AuthMode = 'login' | 'signup' | 'forgot';

export default function Auth() {
  const navigate = useNavigate(); 
  const [mode, setMode] = useState<AuthMode>('login');

  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    email: '',
    password: '',
    confirmPassword: '',
    maintainConnection: false
  });

  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); 
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name] || generalError || successMessage) {
      setErrors(prev => ({ ...prev, [name]: false }));
      setGeneralError(null);
      setSuccessMessage(null);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: boolean } = {};
    let firstErrorMessage: string | null = null;

    if (mode === 'signup') {
      if (!formData.name.trim()) { newErrors.name = true; firstErrorMessage = firstErrorMessage || 'Name is required.'; }
      if (!formData.dob.trim()) { newErrors.dob = true; firstErrorMessage = firstErrorMessage || 'Date of birth is required.'; }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      newErrors.email = true;
      firstErrorMessage = firstErrorMessage || 'Valid email is required.';
    }

    if (mode !== 'forgot') {
      if (!formData.password) {
        newErrors.password = true;
        firstErrorMessage = firstErrorMessage || 'Password is required.';
      } else if (formData.password.length < 6) {
        newErrors.password = true;
        firstErrorMessage = firstErrorMessage || 'Password must be at least 6 characters.';
      }
    }

    if (mode === 'signup') {
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = true;
        firstErrorMessage = firstErrorMessage || 'Passwords do not match.';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setGeneralError(firstErrorMessage);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setGeneralError(null);
    setSuccessMessage(null);

    try {
      if (mode === 'login') {
        const res = await authService.login({ email: formData.email, password: formData.password });
        console.log('Login Success:', res);
        navigate('/'); 

      } else if (mode === 'signup') {
        await authService.signup({ 
          name: formData.name, 
          dob: formData.dob, 
          email: formData.email, 
          password: formData.password 
        });
        setMode('login');
        setSuccessMessage('Registration successful! Please login with your new Soul Imprint.');
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' })); 

      } else if (mode === 'forgot') {
        await authService.forgotPassword(formData.email);
        setSuccessMessage('The repair rune has been sent to your email.');
      }
      
    } catch (error) {
      setGeneralError('A magical anomaly occurred. Please check your credentials or try again later.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInputClass = (fieldName: string) => cn(
    "w-full rounded-xl px-4 py-[clamp(8px,1.5vh,14px)] font-mono text-[clamp(12px,1.5vh,14px)] placeholder:text-slate-500 focus:outline-none transition-all border",
    errors[fieldName] 
      ? "bg-red-50/50 border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-red-900" 
      : "bg-slate-100/50 border-slate-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-800",
    isLoading && "opacity-60 cursor-not-allowed"
  );

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
    setErrors({});
    setGeneralError(null);
    setSuccessMessage(null);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full p-4 md:p-8 relative overflow-hidden min-w-0 min-h-0">
      
      <div className="w-full max-w-5xl mb-[clamp(16px,4vh,48px)] min-w-0 shrink-0 flex flex-col justify-center">
        {mode === 'login' && (
          <div className="w-full flex flex-col items-center gap-[clamp(12px,2vh,32px)]">
            <h1 className="text-[clamp(14px,3.5vw,48px)] font-serif font-bold text-slate-900 tracking-widest whitespace-nowrap text-center">WELCOME BACK, ADVENTURER.</h1>
            <h1 className="text-[clamp(14px,3.5vw,48px)] font-serif font-bold text-slate-900 tracking-widest whitespace-nowrap text-center">PLEASE ENTER YOUR SOUL IMPRINT.</h1>
          </div>
        )}
        {mode === 'signup' && (
          <div className="w-full flex flex-col items-center">
            <h1 className="text-[clamp(14px,3.5vw,48px)] font-serif font-bold text-slate-900 tracking-widest whitespace-nowrap text-center">BRAVE WARRIOR, WELCOME TO JOIN US!</h1>
          </div>
        )}
        {mode === 'forgot' && (
          <div className="w-full flex flex-col items-center gap-[clamp(12px,2vh,32px)]">
            <h1 className="text-[clamp(14px,3.5vw,48px)] font-serif font-bold text-slate-900 tracking-widest whitespace-nowrap text-center">THE PASSWORD HAS BEEN LOST?</h1>
            <p className="text-slate-600 font-mono text-[clamp(10px,1.5vh,14px)] leading-relaxed text-center">
              Don't worry, the Guild Tower can recalibrate your soul wavelength. <br />
              Please enter your email and we will send you the repair rune.
            </p>
          </div>
        )}
      </div>

      {mode !== 'forgot' && (
        <div className="flex items-center gap-4 mb-[clamp(12px,3vh,40px)] shrink-0">
          <button onClick={() => handleModeChange('login')} disabled={isLoading} className={cn("flex items-center gap-2 px-6 py-2 md:px-8 md:py-3 rounded-2xl font-mono font-bold tracking-wider transition-all duration-300 text-[clamp(12px,1.5vh,16px)]", mode === 'login' ? "bg-white text-slate-900 shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-slate-200/60 scale-105" : "text-slate-500 hover:text-slate-800 hover:bg-white/60")}>
            <Key className="w-[clamp(16px,2vh,20px)] h-[clamp(16px,2vh,20px)]" /> LOGIN
          </button>
          <button onClick={() => handleModeChange('signup')} disabled={isLoading} className={cn("flex items-center gap-2 px-6 py-2 md:px-8 md:py-3 rounded-2xl font-mono font-bold tracking-wider transition-all duration-300 text-[clamp(12px,1.5vh,16px)]", mode === 'signup' ? "bg-white text-slate-900 shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-slate-200/60 scale-105" : "text-slate-500 hover:text-slate-800 hover:bg-white/60")}>
            <IdCard className="w-[clamp(16px,2vh,20px)] h-[clamp(16px,2vh,20px)]" /> SIGN UP
          </button>
        </div>
      )}

      <div className="w-full max-w-md flex flex-col items-center shrink-0 min-h-0">
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-[clamp(8px,1.5vh,20px)]">
          
          {mode === 'signup' && (
            <div className="grid grid-cols-2 gap-4">
              <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} disabled={isLoading} className={getInputClass('name')} />
              <input type="text" name="dob" placeholder="Date of birth" value={formData.dob} onChange={handleChange} disabled={isLoading} className={getInputClass('dob')} />
            </div>
          )}

          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} disabled={isLoading} className={getInputClass('email')} />

          {mode !== 'forgot' && (
            <div className="relative">
              <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={formData.password} onChange={handleChange} disabled={isLoading} className={cn(getInputClass('password'), "pr-12")} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={isLoading} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors">
                {showPassword ? <EyeOff className="w-[clamp(16px,2vh,20px)] h-[clamp(16px,2vh,20px)]" /> : <Eye className="w-[clamp(16px,2vh,20px)] h-[clamp(16px,2vh,20px)]" />}
              </button>
            </div>
          )}

          {mode === 'signup' && (
            <div className="relative">
              <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Password confirmation" value={formData.confirmPassword} onChange={handleChange} disabled={isLoading} className={cn(getInputClass('confirmPassword'), "pr-12")} />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} disabled={isLoading} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors">
                {showConfirmPassword ? <EyeOff className="w-[clamp(16px,2vh,20px)] h-[clamp(16px,2vh,20px)]" /> : <Eye className="w-[clamp(16px,2vh,20px)] h-[clamp(16px,2vh,20px)]" />}
              </button>
            </div>
          )}

          {mode === 'login' && (
            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center w-4 h-4 border border-slate-300 rounded bg-slate-100/50 group-hover:border-cyan-400 transition-colors shrink-0">
                  <input type="checkbox" name="maintainConnection" checked={formData.maintainConnection} onChange={handleChange} disabled={isLoading} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" />
                  {formData.maintainConnection && <div className="w-2 h-2 bg-slate-700 rounded-sm" />}
                </div>
                <span className="text-[clamp(10px,1.2vh,12px)] font-mono text-slate-600 whitespace-nowrap">Maintaining the Soul Connection</span>
              </label>
              <button type="button" onClick={() => handleModeChange('forgot')} disabled={isLoading} className="text-[clamp(10px,1.2vh,12px)] font-mono text-slate-400 hover:text-cyan-600 underline underline-offset-4 transition-colors shrink-0">
                Forgot password?
              </button>
            </div>
          )}

          {mode === 'signup' && (
            <div className="text-[clamp(9px,1.1vh,10px)] font-mono text-slate-400 leading-relaxed px-1 mt-1">
              <div className="flex gap-4 mb-[clamp(4px,1vh,8px)]">
                <span className="text-slate-600 font-bold hover:text-cyan-600 cursor-pointer transition-colors">Privacy Policy</span>
                <span className="text-slate-600 font-bold hover:text-cyan-600 cursor-pointer transition-colors">Terms of Service</span>
              </div>
              <p className="line-clamp-3">By clicking "Register," you indicate that you have read and agree to this website's [Terms of Service] and [Privacy Policy]...</p>
            </div>
          )}

          {generalError && (
            <div className="flex items-center gap-2 text-red-500 bg-red-50/80 px-4 py-2 rounded-lg text-[clamp(11px,1.3vh,13px)] font-mono animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{generalError}</span>
            </div>
          )}
          {successMessage && (
            <div className="flex items-center gap-2 text-cyan-700 bg-cyan-50/80 px-4 py-2 rounded-lg text-[clamp(11px,1.3vh,13px)] font-mono animate-in fade-in slide-in-from-top-1">
              <Diamond className="w-4 h-4 shrink-0 text-cyan-500" />
              <span>{successMessage}</span>
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="mt-[clamp(4px,1vh,16px)] w-full bg-white/80 backdrop-blur-sm border border-slate-200/80 shadow-[0_4px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_20px_rgba(34,211,238,0.15)] hover:border-cyan-300/50 rounded-2xl py-[clamp(12px,2vh,16px)] flex items-center justify-center gap-3 font-mono font-bold text-slate-800 transition-all duration-300 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
               <>
                 <Loader2 className="w-5 h-5 animate-spin text-cyan-500" />
                 <span className="text-[clamp(12px,1.5vh,16px)] text-cyan-600">Channeling...</span>
               </>
            ) : mode === 'forgot' ? (
              <>
                <Radio className="w-5 h-5 text-slate-400 group-hover:text-cyan-500 transition-colors" />
                <span className="text-[clamp(12px,1.5vh,16px)]">Send repair wavelength</span>
              </>
            ) : (
              <>
                <Diamond className="w-4 h-4 text-slate-400 group-hover:text-cyan-500 transition-colors shrink-0" />
                <span className="text-[clamp(12px,1.5vh,16px)]">Open the portal</span>
                <Diamond className="w-4 h-4 text-slate-400 group-hover:text-cyan-500 transition-colors shrink-0" />
              </>
            )}
          </button>

        </form>

        {mode === 'forgot' && (
          <button onClick={() => handleModeChange('login')} disabled={isLoading} className="mt-[clamp(16px,4vh,32px)] text-[clamp(12px,1.5vh,14px)] font-mono text-slate-500 hover:text-cyan-600 flex items-center gap-2 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Return to Login Gate
          </button>
        )}
      </div>

    </div>
  );
}
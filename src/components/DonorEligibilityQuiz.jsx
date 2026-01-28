import React, { useState } from 'react';
import { updateDonorEligibility } from '../lib/firestore';
import { CheckCircle, XCircle, ChevronRight, ChevronLeft } from 'lucide-react';

export default function DonorEligibilityQuiz({ userId, onComplete, onClose }) {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({
        age: '',
        weight: '',
        hasTattoo: null,
        hasFever: null,
        onMedication: null
    });
    const [result, setResult] = useState(null); // 'passed' | 'failed'
    const [failReason, setFailReason] = useState('');

    const questions = [
        {
            key: 'age',
            question: "How old are you?",
            type: 'number',
            suffix: 'years'
        },
        {
            key: 'weight',
            question: "What is your weight?",
            type: 'number',
            suffix: 'kg'
        },
        {
            key: 'hasTattoo',
            question: "Have you had a tattoo or piercing in the last 6 months?",
            type: 'boolean'
        },
        {
            key: 'hasFever',
            question: "Do you currently have a fever or flu-like symptoms?",
            type: 'boolean'
        },
        {
            key: 'onMedication',
            question: "Are you currently taking any antibiotics or other medication?",
            type: 'boolean'
        }
    ];

    const handleAnswer = (val) => {
        setAnswers(prev => ({ ...prev, [questions[step].key]: val }));
    };

    const handleNext = async () => {
        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            // Calculate Result
            calculateResult();
        }
    };

    const calculateResult = async () => {
        const age = Number(answers.age);
        const weight = Number(answers.weight);
        const { hasTattoo, hasFever, onMedication } = answers;

        let isEligible = true;
        let reason = '';

        if (age < 18 || age > 65) {
            isEligible = false;
            reason = "Donors must be between 18 and 65 years old.";
        } else if (weight <= 50) {
            isEligible = false;
            reason = "Donors must weigh more than 50kg.";
        } else if (hasTattoo) {
            isEligible = false;
            reason = "You must wait 6 months after getting a tattoo or piercing.";
        } else if (hasFever) {
            isEligible = false;
            reason = "You cannot donate while you have a fever or flu symptoms.";
        } else if (onMedication) {
            isEligible = false;
            reason = "Certain medications may prevent you from donating. Please consult a doctor.";
        }

        setResult(isEligible ? 'passed' : 'failed');
        setFailReason(reason);

        // Update Database
        if (userId) {
            await updateDonorEligibility(userId, isEligible);
        }

        if (onComplete) onComplete(isEligible);
    };

    if (result) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
                    {result === 'passed' ? (
                        <div className="space-y-4">
                            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="h-10 w-10 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">You are Eligible!</h2>
                            <p className="text-slate-600">Great news! You meet all the basic requirements to donate blood.</p>
                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-colors"
                            >
                                Continue to Dashboard
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                <XCircle className="h-10 w-10 text-red-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">Not Eligible at this time</h2>
                            <p className="text-slate-600">{failReason}</p>
                            <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-500">
                                Don't worry! This is often temporary. Please check back later when you meet the criteria.
                            </div>
                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const currentQ = questions[step];
    const canProceed = answers[currentQ.key] !== '' && answers[currentQ.key] !== null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl relative">
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-slate-100 rounded-t-2xl overflow-hidden">
                    <div
                        className="h-full bg-brand-500 transition-all duration-300 ease-out"
                        style={{ width: `${((step + 1) / questions.length) * 100}%` }}
                    />
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                >
                    ✕
                </button>

                <div className="mt-6 mb-8">
                    <span className="text-xs font-bold text-brand-600 tracking-wider uppercase">Question {step + 1} of {questions.length}</span>
                    <h2 className="text-xl font-bold text-slate-900 mt-2">{currentQ.question}</h2>
                </div>

                <div className="space-y-4 mb-8">
                    {currentQ.type === 'number' ? (
                        <div className="relative">
                            <input
                                type="number"
                                value={answers[currentQ.key]}
                                onChange={(e) => handleAnswer(e.target.value)}
                                className="w-full text-center text-3xl font-bold border-b-2 border-slate-200 focus:border-brand-500 outline-none py-2"
                                placeholder="0"
                                autoFocus
                            />
                            <span className="absolute right-0 bottom-3 text-slate-400 font-medium">{currentQ.suffix}</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => handleAnswer(true)}
                                className={`py-4 px-6 rounded-xl border-2 font-bold transition-all ${answers[currentQ.key] === true
                                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                                    }`}
                            >
                                Yes
                            </button>
                            <button
                                onClick={() => handleAnswer(false)}
                                className={`py-4 px-6 rounded-xl border-2 font-bold transition-all ${answers[currentQ.key] === false
                                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                                    }`}
                            >
                                No
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center">
                    <button
                        onClick={() => setStep(step - 1)}
                        disabled={step === 0}
                        className={`p-2 rounded-lg text-slate-400 hover:text-slate-600 disabled:opacity-0`}
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={!canProceed}
                        className="bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold shadow-md transition-all flex items-center gap-2"
                    >
                        {step === questions.length - 1 ? 'Finish' : 'Next'}
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

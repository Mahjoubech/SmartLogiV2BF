
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { registerDestinataire, createColis } from '../colisSlice';
import { selectUser } from '../../auth/authSlice';

interface CreateColisWizardProps {
    onCompleted: () => void;
    onCanceled: () => void;
}

const CreateColisWizard: React.FC<CreateColisWizardProps> = ({ onCompleted, onCanceled }) => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form States
    const [step1Data, setStep1Data] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        adresse: ''
    });

    const [step2Data, setStep2Data] = useState({
        poids: '',
        priorite: 'NORMAL',
        villeDestination: '',
        codePostal: '',
        codePostalOrigine: '',
        description: '',
    });

    const [produits, setProduits] = useState<any[]>([
        { nom: '', categorie: '', quantite: 1, poids: 0.5, prix: 1.0 }
    ]);

    // Handlers
    const handleStep1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStep1Data({ ...step1Data, [e.target.name]: e.target.value });
    };

    const handleStep2Change = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setStep2Data({ ...step2Data, [e.target.name]: e.target.value });
    };

    const handleProductChange = (index: number, field: string, value: any) => {
        const newProduits = [...produits];
        newProduits[index][field] = value;
        setProduits(newProduits);
    };

    const addProduct = () => {
        setProduits([...produits, { nom: '', categorie: '', quantite: 1, poids: 0.5, prix: 1.0 }]);
    };

    const removeProduct = (index: number) => {
        if (produits.length > 1) {
            const newProduits = produits.filter((_, i) => i !== index);
            setProduits(newProduits);
        }
    };

    // Actions
    const handleNextStep = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await dispatch(registerDestinataire(step1Data)).unwrap();
            setCurrentStep(2);
        } catch (err: any) {
            const errorMessage = typeof err === 'string' ? err : 'Erreur lors de l\'enregistrement du destinataire';
            // If user already exists, we can proceed
            if (errorMessage.toLowerCase().includes('existe') || errorMessage.toLowerCase().includes('utilisé') || errorMessage.toLowerCase().includes('already')) {
                setCurrentStep(2);
            } else {
                setError(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!user?.email) return;

        setIsLoading(true);
        setError(null);

        const request = {
            poids: parseFloat(step2Data.poids),
            priorite: step2Data.priorite,
            villeDestination: step2Data.villeDestination,
            codePostal: step2Data.codePostal,
            codePostalOrigine: step2Data.codePostalOrigine,
            description: step2Data.description || 'Livraison Standard',
            clientExpediteurEmail: user.email,
            destinataireEmail: step1Data.email,
            produits: produits.map(p => ({
                nom: p.nom,
                categorie: p.categorie,
                poids: parseFloat(p.poids.toString()),
                prix: parseFloat(p.prix.toString()),
                colisProduit: {
                    quantite: parseInt(p.quantite.toString())
                }
            }))
        };

        try {
            await dispatch(createColis(request)).unwrap();
            onCompleted();
        } catch (err: any) {
            setError(typeof err === 'string' ? err : 'Échec de la création du colis');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white border border-stone-200 rounded-3xl p-8 max-w-4xl w-full mx-auto shadow-sm relative overflow-hidden">
            <div className="flex justify-center mb-8">
                 <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${currentStep >= 1 ? 'bg-orange-500 text-white' : 'bg-stone-100 text-slate-400'}`}>1</div>
                    <div className={`w-16 h-0.5 ${currentStep >= 2 ? 'bg-orange-500' : 'bg-stone-200'}`}></div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${currentStep >= 2 ? 'bg-orange-500 text-white' : 'bg-stone-100 text-slate-400'}`}>2</div>
                 </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 flex items-center gap-3">
                    <span className="text-xl">⚠</span> {error}
                </div>
            )}

            {currentStep === 1 && (
                <form onSubmit={handleNextStep} className="space-y-6 animate-fadeIn">
                    <h3 className="text-slate-900 text-xl font-bold mb-4">Informations du Destinataire</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                             <label className="text-xs uppercase text-slate-500 font-bold tracking-widest">Nom</label>
                             <input name="nom" value={step1Data.nom} onChange={handleStep1Change} required className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-slate-900 focus:border-orange-500 outline-none transition" placeholder="Nom" />
                        </div>
                        <div className="space-y-2">
                             <label className="text-xs uppercase text-slate-500 font-bold tracking-widest">Prénom</label>
                             <input name="prenom" value={step1Data.prenom} onChange={handleStep1Change} required className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-slate-900 focus:border-orange-500 outline-none transition" placeholder="Prénom" />
                        </div>
                        <div className="space-y-2">
                             <label className="text-xs uppercase text-slate-500 font-bold tracking-widest">Email</label>
                             <input name="email" type="email" value={step1Data.email} onChange={handleStep1Change} required className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-slate-900 focus:border-orange-500 outline-none transition" placeholder="email@exemple.com" />
                        </div>
                        <div className="space-y-2">
                             <label className="text-xs uppercase text-slate-500 font-bold tracking-widest">Téléphone</label>
                             <input name="telephone" value={step1Data.telephone} onChange={handleStep1Change} required className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-slate-900 focus:border-orange-500 outline-none transition" placeholder="+212 600..." />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                             <label className="text-xs uppercase text-slate-500 font-bold tracking-widest">Adresse</label>
                             <input name="adresse" value={step1Data.adresse} onChange={handleStep1Change} required className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-slate-900 focus:border-orange-500 outline-none transition" placeholder="123 Rue, Ville" />
                        </div>
                    </div>
                    <div className="flex justify-between pt-6 border-t border-stone-100">
                        <button type="button" onClick={onCanceled} className="px-6 py-3 rounded-xl bg-stone-100 text-slate-600 hover:bg-stone-200 transition font-bold">Annuler</button>
                        <button type="submit" disabled={isLoading} className="px-8 py-3 rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition font-bold shadow-lg shadow-orange-500/20 disabled:opacity-50">
                            {isLoading ? 'Enregistrement...' : 'Suivant >'}
                        </button>
                    </div>
                </form>
            )}

            {currentStep === 2 && (
                <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
                    <h3 className="text-slate-900 text-xl font-bold mb-4">Détails du Colis & Articles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                             <label className="text-xs uppercase text-slate-500 font-bold tracking-widest">Poids (kg)</label>
                             <input name="poids" type="number" step="0.1" value={step2Data.poids} onChange={handleStep2Change} required className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-slate-900 focus:border-orange-500 outline-none transition" placeholder="0.0" />
                        </div>
                        <div className="space-y-2">
                             <label className="text-xs uppercase text-slate-500 font-bold tracking-widest">Priorité</label>
                             <select name="priorite" value={step2Data.priorite} onChange={handleStep2Change} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-slate-900 focus:border-orange-500 outline-none transition">
                                <option value="BASIQUE" className="text-slate-900">Basique (Low)</option>
                                <option value="NORMAL" className="text-slate-900">Normal (Standard)</option>
                                <option value="URGENT" className="text-slate-900">Urgent (High)</option>
                             </select>
                        </div>
                         <div className="space-y-2">
                             <label className="text-xs uppercase text-slate-500 font-bold tracking-widest">Ville de Destination</label>
                             <input name="villeDestination" value={step2Data.villeDestination} onChange={handleStep2Change} required className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-slate-900 focus:border-orange-500 outline-none transition" placeholder="Casablanca" />
                        </div>
                        <div className="space-y-2">
                             <label className="text-xs uppercase text-slate-500 font-bold tracking-widest">Code Postal Dest.</label>
                             <input name="codePostal" value={step2Data.codePostal} onChange={handleStep2Change} required className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-slate-900 focus:border-orange-500 outline-none transition" placeholder="20000" />
                        </div>
                        <div className="space-y-2">
                             <label className="text-xs uppercase text-slate-500 font-bold tracking-widest">Code Postal Origine</label>
                             <input name="codePostalOrigine" value={step2Data.codePostalOrigine} onChange={handleStep2Change} required className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-slate-900 focus:border-orange-500 outline-none transition" placeholder="10000" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                             <label className="text-xs uppercase text-slate-500 font-bold tracking-widest">Description</label>
                             <textarea name="description" value={step2Data.description} onChange={handleStep2Change} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-slate-900 focus:border-orange-500 outline-none transition" rows={2} placeholder="Notes optionnelles..." />
                        </div>
                    </div>

                    <div className="mt-8">
                        <div className="flex justify-between items-center mb-4">
                             <label className="text-xs uppercase text-slate-500 font-bold tracking-widest">Articles (Manifeste)</label>
                             <button type="button" onClick={addProduct} className="text-orange-600 text-sm font-bold hover:text-orange-700 transition">+ Ajouter Article</button>
                        </div>
                        <div className="space-y-3">
                            {produits.map((p, i) => (
                                <div key={i} className="flex gap-3 items-start">
                                    <input placeholder="Nom Article" value={p.nom} onChange={(e) => handleProductChange(i, 'nom', e.target.value)} className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-slate-900 text-sm focus:border-orange-500 outline-none" required />
                                    <input placeholder="Qté" type="number" min="1" value={p.quantite} onChange={(e) => handleProductChange(i, 'quantite', e.target.value)} className="w-20 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-slate-900 text-sm focus:border-orange-500 outline-none" required />
                                    <input placeholder="Kg" type="number" min="0.1" step="0.1" value={p.poids} onChange={(e) => handleProductChange(i, 'poids', e.target.value)} className="w-20 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-slate-900 text-sm focus:border-orange-500 outline-none" required />
                                    <button type="button" onClick={() => removeProduct(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">×</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between pt-6 border-t border-stone-100">
                        <button type="button" onClick={() => setCurrentStep(1)} className="px-6 py-3 rounded-xl bg-stone-100 text-slate-600 hover:bg-stone-200 transition font-bold">Retour</button>
                        <button type="submit" disabled={isLoading} className="px-8 py-3 rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition font-bold shadow-lg shadow-orange-500/20 disabled:opacity-50">
                            {isLoading ? 'Traitement...' : 'Créer l\'Expédition'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default CreateColisWizard;

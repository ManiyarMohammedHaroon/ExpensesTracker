import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import Tesseract from 'tesseract.js';

const AddExpense = () => {
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [ocrProgress, setOcrProgress] = useState(0);
    const navigate = useNavigate();

    const categories = ['Food', 'Transport', 'Rent', 'Utilities', 'Shopping', 'Other'];

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        setOcrProgress(0);

        try {
            const { data: { text } } = await Tesseract.recognize(
                file,
                'eng',
                { logger: m => { if (m.status === 'recognizing text') setOcrProgress(parseInt(m.progress * 100)); } }
            );

            console.log("Full OCR Text:", text);
            const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

            let extractedData = {};

            // 1. Extract Title (Usually first line, often store name)
            if (lines.length > 0) {
                extractedData.title = lines[0].substring(0, 50); // Limit title length
            }

            // 2. Extract Amount (Look for common keywords or the largest currency-like value)
            // Strategy: Find strings like "TOTAL", "AMOUNT", "NET", "CASH" or just currency patterns
            const amountPatterns = [
                /(?:TOTAL|TOTAL AMOUNT|AMOUNT|NET|CASH|PAID|DUE|BALANCE)[\s\:\=]*[\$\£\€]?\s*([\d,]+\.\d{2})/i,
                /[\$\£\€]\s*([\d,]+\.\d{2})/,
                /([\d,]+\.\d{2})/
            ];

            let foundAmount = null;
            for (let pattern of amountPatterns) {
                const match = text.match(pattern);
                if (match) {
                    foundAmount = match[1].replace(/,/g, '');
                    break;
                }
            }
            if (foundAmount) extractedData.amount = foundAmount;

            // 3. Extract Date (Look for common date patterns)
            const datePatterns = [
                /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/, // MM/DD/YYYY or DD/MM/YYYY
                /(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\s+\d{1,2},?\s+\d{4}/i // Month DD, YYYY
            ];

            for (let pattern of datePatterns) {
                const match = text.match(pattern);
                if (match) {
                    try {
                        const parsedDate = new Date(match[1]);
                        if (!isNaN(parsedDate.getTime())) {
                            extractedData.date = parsedDate.toISOString().split('T')[0];
                        }
                    } catch (e) { }
                    break;
                }
            }

            setFormData(prev => ({ ...prev, ...extractedData }));
            alert("Details extracted from receipt! Please verify the fields.");

        } catch (err) {
            console.error("OCR Error:", err);
            alert("Failed to process receipt. Please enter details manually.");
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/expenses', formData);
            navigate('/expenses');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container" style={{ alignItems: 'flex-start', paddingTop: '2rem' }}>
            <div className="auth-card" style={{ maxWidth: '600px' }}>
                <div className="auth-header">
                    <h1>Add New Expense</h1>
                    <p>Enter details or upload a receipt to auto-fill</p>
                </div>

                <div className="form-group">
                    <label>Upload Receipt (OCR)</label>
                    <input type="file" onChange={handleFileUpload} className="form-control" accept="image/*" />
                    {loading && <p className="text-sm mt-2">Processing: {ocrProgress}%</p>}
                </div>

                <hr style={{ margin: '2rem 0', borderColor: 'var(--border)' }} />

                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label>Title</label>
                        <input type="text" name="title" className="form-control" value={formData.title} onChange={onChange} required />
                    </div>
                    <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label>Amount</label>
                            <input type="number" name="amount" className="form-control" value={formData.amount} onChange={onChange} required />
                        </div>
                        <div>
                            <label>Category</label>
                            <select name="category" className="form-control" value={formData.category} onChange={onChange}>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label>Date</label>
                            <input type="date" name="date" className="form-control" value={formData.date} onChange={onChange} required />
                        </div>
                        <div>
                            <label>Description (Optional)</label>
                            <input type="text" name="description" className="form-control" value={formData.description} onChange={onChange} />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary mt-4">Save Expense</button>
                    <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-outline mt-2">Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default AddExpense;

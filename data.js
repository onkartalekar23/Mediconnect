/* Mock Database */

const DATA = {
    symptoms: [
        "Fever", "Cough", "Headache", "Stomach Pain", "Fatigue",
        "Sore Throat", "Skin Rash", "Joint Pain", "Nausea", "Breathing Difficulty"
    ],

    // Simple logic: map symptoms to probable conditions
    diagnoses: {
        "Fever": ["Viral Fever", "Malaria", "Typhoid", "Dengue"],
        "Cough": ["Common Cold", "Bronchitis", "Pneumonia", "Tuberculosis"],
        "Headache": ["Migraine", "Stress", "Hypertension", "Sinusitis"],
        "Stomach Pain": ["Gastritis", "Food Poisoning", "Appendicitis", "Peptic Ulcer"],
        "Joint Pain": ["Arthritis", "Dengue", "Chikungunya"],
        "Skin Rash": ["Allergy", "Measles", "Chickenpox", "Dermatitis"],
        "Breathing Difficulty": ["Asthma", "COPD", "Pneumonia"]
    },

    // Detailed info for each condition
    medicines: {
        "Viral Fever": {
            drugs: ["Paracetamol 500mg", "Ibuprofen"],
            advice: "Rest well, stay hydrated."
        },
        "Malaria": {
            drugs: ["Chloroquine", "Artemisinin-based combination therapy (ACT)"],
            advice: "Consult a doctor immediately for blood tests."
        },
        "Typhoid": {
            drugs: ["Ciprofloxacin", "Azithromycin"],
            advice: "Drink boiled water, avoid street food."
        },
        "Common Cold": {
            drugs: ["Cetirizine", "Paracetamol", "Decongestants"],
            advice: "Steam inhalation, warm fluids."
        },
        "Tuberculosis": {
            drugs: ["Isoniazid", "Rifampicin", "Pyrazinamide", "Ethambutol"],
            advice: "Strict adherence to DOTS course is mandatory."
        },
        "Diabetes (General)": { // Added for scheme demo
            drugs: ["Metformin", "Insulin"],
            advice: "Regular blood sugar monitoring, diet control."
        },
        "Cancer (General)": { // Added for scheme demo
            drugs: ["Chemotherapy agents", "Immunotherapy"],
            advice: "Oncologist consultation required."
        }
    },

    // Government Schemes
    schemes: [
        {
            name: "Ayushman Bharat - PMJAY",
            conditions: ["Cancer (General)", "Heart Disease", "Kidney Disease", "Serious Surgeries", "Tuberculosis"],
            benefits: "Up to ₹5 Lakh coverage per family per year for secondary and tertiary care hospitalization.",
            documents: ["Aadhaar Card", "Ration Card", "Income Certificate"],
            link: "https://pmjay.gov.in/",
            eligibility: "Low-income families as per SECC 2011 data."
        },
        {
            name: "Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP)",
            conditions: ["All (Generic Medicines)"],
            benefits: "High-quality generic medicines at 50-90% lower prices.",
            documents: ["Prescription from a registered medical practitioner"],
            link: "http://janaushadhi.gov.in/",
            eligibility: "All citizens."
        },
        {
            name: "Nikshay Poshan Yojana",
            conditions: ["Tuberculosis"],
            benefits: "₹500 per month for nutritional support to TB patients.",
            documents: ["Bank Account Details", "Aadhaar Card", "TB Treatment Card"],
            link: "https://nikshay.in/",
            eligibility: "Notified TB patients."
        },
        {
            name: "Rashtriya Arogya Nidhi (RAN)",
            conditions: ["Cancer (General)", "Rare Diseases", "Heart Disease"],
            benefits: "One-time financial assistance to poor patients for specialized treatment.",
            documents: ["BPL Card", "Income Certificate", "Medical Report"],
            link: "https://main.mohfw.gov.in/Major-Programmes/poor-patients-financial-assistance",
            eligibility: "Below Poverty Line (BPL) families."
        }
    ],

    hospitals: [
        {
            name: "Civil Hospital, Mumbai",
            type: "Government",
            location: "Mumbai, Maharashtra",
            specialty: "General, Trauma",
            coords: "19.0760, 72.8777"
        },
        {
            name: "AIIMS New Delhi",
            type: "Government (Central)",
            location: "Ansari Nagar, New Delhi",
            specialty: "Multi-specialty, Research",
            coords: "28.5672, 77.2100"
        },
        {
            name: "Sassoon General Hospital",
            type: "Government",
            location: "Pune, Maharashtra",
            specialty: "General",
            coords: "18.5204, 73.8567"
        },
        {
            name: "Tata Memorial Hospital",
            type: "Semi-Govt/Trust",
            location: "Parel, Mumbai",
            specialty: "Oncology (Cancer)",
            coords: "19.0060, 72.8417"
        },
        {
            name: "KEM Hospital",
            type: "Municipal",
            location: "Parel, Mumbai",
            specialty: "General, Cardiology",
            coords: "19.0026, 72.8420"
        }
    ],

    // Translations for Data Terms
    termTranslations: {
        // Symptoms
        "Fever": "ताप",
        "Cough": "खोकला",
        "Headache": "डोकेदुखी",
        "Stomach Pain": "पोटदुखी",
        "Fatigue": "थकवा",
        "Sore Throat": "घसा खवखवणे",
        "Skin Rash": "त्वचेवर पुरळ",
        "Joint Pain": "सांधेदुखी",
        "Nausea": "मळमळ",
        "Breathing Difficulty": "श्वास घेण्यास त्रास",

        // Diseases
        "Viral Fever": "व्हायरल ताप",
        "Malaria": "मलेरिया",
        "Typhoid": "टायफाइड",
        "Dengue": "डेंग्यू",
        "Common Cold": "सामान्य सर्दी",
        "Bronchitis": "ब्राँकायटिस",
        "Pneumonia": "न्यूमोनिया",
        "Tuberculosis": "क्षयरोग (TB)",
        "Migraine": "मायग्रेन",
        "Stress": "तणाव",
        "Hypertension": "उच्च रक्तदाब",
        "Sinusitis": "साइनस",
        "Gastritis": "गॅस्ट्र्रिटिस",
        "Food Poisoning": "अन्न विषबाधा",
        "Appendicitis": "अपेंडिसाइटिस",
        "Peptic Ulcer": "पेप्टिक अल्सर",
        "Arthritis": "संधिवात",
        "Chikungunya": "चिकुनगुनिया",
        "Allergy": "एलर्जी",
        "Measles": "गोवर",
        "Chickenpox": "कांजण्या",
        "Dermatitis": "त्वचारोग",
        "Asthma": "दम्याची बीमारी",
        "COPD": "कनाल सीओपीडी",
        "Diabetes (General)": "मधुमेह",
        "Cancer (General)": "कर्करोग"
    }
};

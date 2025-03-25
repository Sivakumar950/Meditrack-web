import MedicationForm from './MedicationForm';

function ExtractedDataSection({ medications, onMedicationChange, onSchedule }) {
  return (
    <div className="card">
      <h2>Extracted Medications</h2>
      {medications.map((med, index) => (
        <MedicationForm
          key={index}
          medication={med}
          onChange={(updatedMed) => onMedicationChange(index, updatedMed)}
          isEditable={true}
        />
      ))}
      <button onClick={onSchedule} className="btn">
        Schedule Extracted Data
      </button>
    </div>
  );
}

export default ExtractedDataSection;
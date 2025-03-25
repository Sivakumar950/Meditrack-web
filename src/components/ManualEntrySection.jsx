import MedicationForm from './MedicationForm';

function ManualEntrySection({ medications, onAddMedication, onMedicationChange, onSubmitManualData }) {
  return (
    <div className="manual-entry-section p-6 bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Manual Entry</h2>
      {medications.map((med, index) => (
        <div key={med.id} className="mb-6 border-b pb-4">
          <MedicationForm
            medication={med}
            onChange={(updatedMed) => onMedicationChange(index, updatedMed)}
            isEditable={true}
          />
        </div>
      ))}
      <div className="flex justify-between mt-4">
        <button
          onClick={onAddMedication}
          className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Medication
        </button>
        <button
          onClick={onSubmitManualData}
          className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Submit Manual Data
        </button>
      </div>
    </div>
  );
}

export default ManualEntrySection;
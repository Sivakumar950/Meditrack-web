import { useState, useEffect } from 'react';

function MedicationForm({ medication, onChange, isEditable }) {
  // Local state to manage form values
  const [formValues, setFormValues] = useState({
    name: medication.name || '',
    dosage: medication.dosage || '',
    timing: medication.timing || ['', ''],
    duration_value: medication.duration_value || '',
    duration_unit: medication.duration_unit || 'days',
    special_instructions: medication.special_instructions || '',
  });

  // Sync local state with prop changes (e.g., if medication prop changes externally)
  useEffect(() => {
    setFormValues({
      name: medication.name || '',
      dosage: medication.dosage || '',
      timing: medication.timing || ['', ''],
      duration_value: medication.duration_value || '',
      duration_unit: medication.duration_unit || 'days',
      special_instructions: medication.special_instructions || '',
    });
  }, [medication]);

  // Update local state on input change
  const handleInputChange = (field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Update timing array in local state
  const handleTimingChange = (index, value) => {
    const newTiming = [...formValues.timing];
    newTiming[index] = value;
    handleInputChange('timing', newTiming);
  };

  // Update parent state on blur (when the user finishes editing the field)
  const handleBlur = () => {
    onChange({
      ...medication,
      name: formValues.name,
      dosage: formValues.dosage,
      timing: formValues.timing,
      duration_value: formValues.duration_value,
      duration_unit: formValues.duration_unit,
      special_instructions: formValues.special_instructions,
    });
  };

  return (
    <div className="medication">
      <div className="form-group">
        <label>Medication Name:</label>
        <input
          type="text"
          value={formValues.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          onBlur={handleBlur}
          readOnly={!isEditable}
          placeholder="e.g., Augmentin"
        />
      </div>
      <div className="form-group">
        <label>Dosage:</label>
        <input
          type="text"
          value={formValues.dosage}
          onChange={(e) => handleInputChange('dosage', e.target.value)}
          onBlur={handleBlur}
          readOnly={!isEditable}
          placeholder="e.g., 625mg"
        />
      </div>
      <div className="form-group">
        <label>Time Slots (e.g., 08:00, 20:00):</label>
        <div className="time-input-group">
          {[0, 1].map((i) => (
            <input
              key={i}
              type="text"
              value={formValues.timing[i] || ''}
              onChange={(e) => handleTimingChange(i, e.target.value)}
              onBlur={handleBlur}
              readOnly={!isEditable}
              placeholder={`e.g., ${i === 0 ? '08:00' : '20:00'}`}
            />
          ))}
        </div>
      </div>
      <div className="form-group">
        <label>Duration:</label>
        <div className="duration-input-group">
          <input
            type="number"
            value={formValues.duration_value}
            onChange={(e) => handleInputChange('duration_value', e.target.value)}
            onBlur={handleBlur}
            readOnly={!isEditable}
            placeholder="e.g., 5"
          />
          <div className="toggle-group">
            {['days', 'weeks', 'months'].map((unit) => (
              <label key={unit}>
                <input
                  type="radio"
                  name={`durationUnit-${medication.id}`}
                  value={unit}
                  checked={formValues.duration_unit === unit}
                  onChange={() => handleInputChange('duration_unit', unit)}
                  onBlur={handleBlur}
                  disabled={!isEditable}
                />
                <span className="toggle-btn">
                  {unit.charAt(0).toUpperCase() + unit.slice(1)}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className="form-group">
        <label>Special Instructions:</label>
        <input
          type="text"
          value={formValues.special_instructions}
          onChange={(e) => handleInputChange('special_instructions', e.target.value)}
          onBlur={handleBlur}
          readOnly={!isEditable}
          placeholder="e.g., after meals"
        />
      </div>
    </div>
  );
}

export default MedicationForm;
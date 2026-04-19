export const inputClass =
  "w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-swamp/30 focus:border-swamp text-sm";

type FieldProps = {
  label: string;
  required?: boolean;
  children: React.ReactNode;
};

export const Field = ({ label, required, children }: FieldProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

type ModalProps = {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

export const Modal = ({ title, onClose, children }: ModalProps) => (
  <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-xl leading-none"
        >
          ✕
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

type ModalActionsProps = {
  onCancel: () => void;
  saving: boolean;
  editing: boolean;
};

export const ModalActions = ({
  onCancel,
  saving,
  editing,
}: ModalActionsProps) => (
  <div className="flex gap-3 pt-2">
    <button
      type="button"
      onClick={onCancel}
      className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
    >
      Cancel
    </button>
    <button
      type="submit"
      disabled={saving}
      className="flex-1 py-2.5 bg-swamp text-white rounded-xl text-sm font-medium hover:bg-[#02543d] disabled:opacity-60"
    >
      {saving ? "Saving..." : editing ? "Update" : "Create"}
    </button>
  </div>
);

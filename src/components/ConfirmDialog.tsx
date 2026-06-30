import { useEffect } from 'react';

interface ConfirmDialogProps {
    open: boolean;
    title?: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    danger?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

/**
 * Themed replacement for window.confirm(). Renders nothing when `open` is
 * false, so it can be mounted unconditionally near the top of a page.
 */
export default function ConfirmDialog({
    open,
    title = 'Please confirm',
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    danger = false,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    useEffect(() => {
        if (!open) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onCancel();
            if (e.key === 'Enter') onConfirm();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [open, onConfirm, onCancel]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onCancel}
                aria-hidden="true"
            />

            {/* Dialog */}
            <div className="relative w-full max-w-sm bg-[#1a1a2e] border border-white/15 rounded-2xl shadow-2xl p-6 animate-fadeIn">
                <h3 className="text-lg font-semibold text-white mb-2 font-display">{title}</h3>
                <p className="text-sm text-white/70 mb-6 leading-relaxed">{message}</p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-xl text-sm font-medium bg-white/10 text-white/80 hover:bg-white/20 transition-all"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        autoFocus
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            danger
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-[#d4a853] text-[#1a1a2e] hover:bg-[#c79a45]'
                        }`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

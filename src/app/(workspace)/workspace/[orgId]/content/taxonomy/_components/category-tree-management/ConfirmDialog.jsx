'use client';

import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, type = 'warning' }) => {
    if (!isOpen) return null;

    const config = {
        warning: {
            icon: 'ExclamationTriangleIcon',
            iconColor: 'text-warning',
            iconBg: 'bg-warning/10',
            confirmText: 'Confirm',
            confirmClass: 'bg-warning hover:bg-warning/90 text-warning-foreground'
        },
        danger: {
            icon: 'XCircleIcon',
            iconColor: 'text-error',
            iconBg: 'bg-error/10',
            confirmText: 'Delete',
            confirmClass: 'bg-error hover:bg-error/90 text-error-foreground'
        },
        info: {
            icon: 'InformationCircleIcon',
            iconColor: 'text-primary',
            iconBg: 'bg-primary/10',
            confirmText: 'Confirm',
            confirmClass: 'bg-primary hover:bg-primary/90 text-primary-foreground'
        }
    };

    const { icon, iconColor, iconBg, confirmText, confirmClass } = config?.[type] || config?.warning;

    return (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-text-primary/50 backdrop-blur-sm">
            <div className="bg-surface rounded-lg shadow-elevation-3 w-full max-w-md">
                <div className="p-6">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center mb-4`}>
                        <Icon name={icon} size={24} variant="solid" className={iconColor} />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>

                    {/* Message */}
                    <p className="text-sm text-text-secondary leading-relaxed">{message}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
                    <button
                        onClick={onClose}
                        className="px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-muted rounded-lg transition-colors duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`px-4 py-2.5 text-sm font-medium rounded-lg shadow-elevation-1 transition-all duration-200 ${confirmClass}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

ConfirmDialog.propTypes = {
    isOpen: PropTypes?.bool?.isRequired,
    onClose: PropTypes?.func?.isRequired,
    onConfirm: PropTypes?.func?.isRequired,
    title: PropTypes?.string?.isRequired,
    message: PropTypes?.string?.isRequired,
    type: PropTypes?.oneOf(['warning', 'danger', 'info'])
};

export default ConfirmDialog;
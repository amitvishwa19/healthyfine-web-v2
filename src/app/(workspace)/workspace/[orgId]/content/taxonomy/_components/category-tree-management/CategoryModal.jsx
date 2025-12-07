'use client';

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const CategoryModal = ({ isOpen, onClose, onSave, category, mode, parentCategory, allCategories = [] }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        tags: [],
        parentId: null
    });

    const [errors, setErrors] = useState({});

    const availableTags = [
        { id: 'tag1', name: 'Cardiology', color: '#EF4444' },
        { id: 'tag2', name: 'Neurology', color: '#3B82F6' },
        { id: 'tag3', name: 'Pediatrics', color: '#10B981' },
        { id: 'tag4', name: 'Emergency', color: '#F59E0B' },
        { id: 'tag5', name: 'Surgery', color: '#8B5CF6' },
        { id: 'tag6', name: 'Radiology', color: '#EC4899' }
    ];

    useEffect(() => {
        if (category && mode === 'edit') {
            setFormData({
                name: category?.name || '',
                description: category?.description || '',
                tags: category?.tags || [],
                parentId: category?.parentId || null
            });
        } else if (mode === 'subcategory' && parentCategory) {
            setFormData({
                name: '',
                description: '',
                tags: [],
                parentId: parentCategory?.id || null
            });
        } else {
            setFormData({
                name: '',
                description: '',
                tags: [],
                parentId: null
            });
        }
        setErrors({});
    }, [category, mode, isOpen, parentCategory]);

    // Helper function to flatten categories into a selectable list
    const flattenCategoriesForSelection = (cats, level = 0, currentCategoryId = null) => {
        let result = [];
        cats?.forEach(cat => {
            // Don't include the current category being edited (prevent circular parent)
            if (cat?.id !== currentCategoryId) {
                result?.push({
                    id: cat?.id,
                    name: cat?.name,
                    path: cat?.path,
                    level: level,
                    isArchived: cat?.isArchived
                });
                if (cat?.children && cat?.children?.length > 0) {
                    result = result?.concat(flattenCategoriesForSelection(cat?.children, level + 1, currentCategoryId));
                }
            }
        });
        return result;
    };

    const selectableCategories = flattenCategoriesForSelection(
        allCategories,
        0,
        mode === 'edit' ? category?.id : null
    )?.filter(cat => !cat?.isArchived); // Filter out archived categories

    const handleChange = (e) => {
        const { name, value } = e?.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors?.[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleParentChange = (e) => {
        const parentId = e?.target?.value || null;
        setFormData(prev => ({
            ...prev,
            parentId: parentId
        }));
    };

    const toggleTag = (tag) => {
        setFormData(prev => {
            const isSelected = prev?.tags?.some(t => t?.id === tag?.id);
            return {
                ...prev,
                tags: isSelected
                    ? prev?.tags?.filter(t => t?.id !== tag?.id)
                    : [...prev?.tags, tag]
            };
        });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData?.name?.trim()) {
            newErrors.name = 'Category name is required';
        }
        if (formData?.name?.trim()?.length < 2) {
            newErrors.name = 'Category name must be at least 2 characters';
        }
        setErrors(newErrors);
        return Object.keys(newErrors)?.length === 0;
    };

    const handleSubmit = (e) => {
        e?.preventDefault();
        if (validate()) {
            onSave(formData);
            onClose();
        }
    };

    if (!isOpen) return null;

    const modalTitle = mode === 'edit' ? 'Edit Category'
        : mode === 'subcategory'
            ? `Add Subcategory to "${parentCategory?.name}"`
            : 'Add New Category';

    const getSelectedParentName = () => {
        if (!formData?.parentId) return null;
        const parent = selectableCategories?.find(cat => cat?.id === formData?.parentId);
        return parent?.name;
    };

    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-text-primary/50 backdrop-blur-sm">
            <div className="bg-surface rounded-lg shadow-elevation-3 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-xl font-semibold text-text-primary">{modalTitle}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                        <Icon name="XMarkIcon" size={20} variant="outline" className="text-text-secondary" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Parent Category Selector */}
                    {mode !== 'subcategory' && selectableCategories?.length > 0 && (
                        <div>
                            <label htmlFor="parentId" className="block text-sm font-medium text-text-primary mb-2">
                                Parent Category
                            </label>
                            <div className="relative">
                                <select
                                    id="parentId"
                                    name="parentId"
                                    value={formData?.parentId || ''}
                                    onChange={handleParentChange}
                                    className="w-full px-4 py-2.5 bg-surface border border-input rounded-lg text-text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
                                >
                                    <option value="">None (Root Category)</option>
                                    {selectableCategories?.map((cat) => (
                                        <option key={cat?.id} value={cat?.id}>
                                            {'└─'?.repeat(cat?.level)} {cat?.name}
                                        </option>
                                    ))}
                                </select>
                                <Icon
                                    name="ChevronDownIcon"
                                    size={20}
                                    variant="outline"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
                                />
                            </div>
                            {formData?.parentId && (
                                <p className="mt-1.5 text-sm text-text-secondary flex items-center gap-1">
                                    <Icon name="InformationCircleIcon" size={14} variant="solid" className="text-primary" />
                                    Will be nested under "{getSelectedParentName()}"
                                </p>
                            )}
                        </div>
                    )}

                    {/* Category Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
                            Category Name <span className="text-error">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData?.name}
                            onChange={handleChange}
                            placeholder="Enter category name"
                            className={`w-full px-4 py-2.5 bg-surface border rounded-lg text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200 ${errors?.name ? 'border-error' : 'border-input'
                                }`}
                        />
                        {errors?.name && (
                            <p className="mt-1.5 text-sm text-error flex items-center gap-1">
                                <Icon name="ExclamationCircleIcon" size={14} variant="solid" />
                                {errors?.name}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData?.description}
                            onChange={handleChange}
                            placeholder="Enter category description"
                            rows={4}
                            className="w-full px-4 py-2.5 bg-surface border border-input rounded-lg text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200 resize-none"
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-3">
                            Assign Tags
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {availableTags?.map((tag) => {
                                const isSelected = formData?.tags?.some(t => t?.id === tag?.id);
                                return (
                                    <button
                                        key={tag?.id}
                                        type="button"
                                        onClick={() => toggleTag(tag)}
                                        className={`
                      inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium
                      transition-all duration-200 ease-out
                      ${isSelected
                                                ? 'ring-2 ring-offset-2' : 'opacity-60 hover:opacity-100'
                                            }
                    `}
                                        style={{
                                            backgroundColor: `${tag?.color}20`,
                                            color: tag?.color,
                                            ringColor: isSelected ? tag?.color : 'transparent'
                                        }}
                                    >
                                        <Icon
                                            name={isSelected ? 'CheckIcon' : 'TagIcon'}
                                            size={14}
                                            variant="solid"
                                        />
                                        {tag?.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Parent Category Info for Subcategory Mode */}
                    {mode === 'subcategory' && parentCategory && (
                        <div className="p-4 bg-muted rounded-lg border border-border">
                            <div className="flex items-center gap-2 mb-2">
                                <Icon name="InformationCircleIcon" size={16} variant="solid" className="text-primary" />
                                <span className="text-sm font-medium text-text-primary">Parent Category</span>
                            </div>
                            <p className="text-sm text-text-secondary">{parentCategory?.name}</p>
                        </div>
                    )}
                </form>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-muted rounded-lg transition-colors duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2.5 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg shadow-elevation-1 transition-all duration-200 flex items-center gap-2"
                    >
                        <Icon name="CheckIcon" size={16} variant="outline" />
                        {mode === 'edit' ? 'Save Changes' : 'Create Category'}
                    </button>
                </div>
            </div>
        </div>
    );
};

CategoryModal.propTypes = {
    isOpen: PropTypes?.bool?.isRequired,
    onClose: PropTypes?.func?.isRequired,
    onSave: PropTypes?.func?.isRequired,
    category: PropTypes?.shape({
        id: PropTypes?.string,
        name: PropTypes?.string,
        description: PropTypes?.string,
        tags: PropTypes?.array,
        parentId: PropTypes?.string
    }),
    mode: PropTypes?.oneOf(['add', 'edit', 'subcategory'])?.isRequired,
    parentCategory: PropTypes?.shape({
        id: PropTypes?.string,
        name: PropTypes?.string
    }),
    allCategories: PropTypes?.array
};

export default CategoryModal;
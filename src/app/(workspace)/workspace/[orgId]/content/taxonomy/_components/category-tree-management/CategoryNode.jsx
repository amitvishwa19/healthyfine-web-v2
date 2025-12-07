'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const CategoryNode = ({
    category,
    level = 0,
    onSelect,
    selectedId,
    onExpand,
    expandedIds,
    onDragStart,
    onDragOver,
    onDrop,
    onAddSubcategory,
    onEdit,
    onDelete,
    onArchive
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const isExpanded = expandedIds?.includes(category?.id);
    const isSelected = selectedId === category?.id;
    const hasChildren = category?.children && category?.children?.length > 0;

    const handleDragStart = (e) => {
        setIsDragging(true);
        onDragStart(category);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e?.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        onDragOver(category);
    };

    const handleDrop = (e) => {
        e?.preventDefault();
        e?.stopPropagation();
        onDrop(category);
    };

    const toggleExpand = (e) => {
        e?.stopPropagation();
        if (hasChildren) {
            onExpand(category?.id);
        }
    };

    const handleSelect = () => {
        onSelect(category);
    };

    const handleAction = (e, action) => {
        e?.stopPropagation();
        action(category);
    };

    return (
        <div className="select-none">
            <div
                draggable
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleSelect}
                className={`
          flex items-center gap-2 py-2.5 px-3 rounded-lg cursor-pointer
          transition-all duration-200 ease-out
          ${isSelected ? 'bg-primary text-primary-foreground shadow-elevation-1' : 'hover:bg-muted'}
          ${isDragging ? 'opacity-50' : 'opacity-100'}
        `}
                style={{ paddingLeft: `${level * 24 + 12}px` }}
            >
                {/* Expand/Collapse Button */}
                <button
                    onClick={toggleExpand}
                    className={`
            flex-shrink-0 w-5 h-5 flex items-center justify-center rounded
            transition-all duration-200 ease-out
            ${hasChildren ? 'hover:bg-muted' : 'invisible'}
            ${isSelected ? 'text-primary-foreground' : 'text-text-secondary'}
          `}
                >
                    {hasChildren && (
                        <Icon
                            name="ChevronRightIcon"
                            size={16}
                            variant="solid"
                            className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                        />
                    )}
                </button>

                {/* Folder Icon */}
                <Icon
                    name={isExpanded ? 'FolderOpenIcon' : 'FolderIcon'}
                    size={20}
                    variant={isSelected ? 'solid' : 'outline'}
                    className={`flex-shrink-0 ${isSelected ? 'text-primary-foreground' : 'text-primary'}`}
                />

                {/* Category Name */}
                <span className={`flex-1 text-sm font-medium truncate ${isSelected ? 'text-primary-foreground' : 'text-text-primary'}`}>
                    {category?.name}
                </span>

                {/* Badges */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    {category?.subcategoryCount > 0 && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${isSelected ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-text-secondary'}`}>
                            {category?.subcategoryCount}
                        </span>
                    )}
                    {category?.contentCount > 0 && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${isSelected ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
                            {category?.contentCount} items
                        </span>
                    )}
                    {category?.isArchived && (
                        <Icon
                            name="ArchiveBoxIcon"
                            size={16}
                            variant="outline"
                            className={isSelected ? 'text-primary-foreground' : 'text-warning'}
                        />
                    )}
                </div>

                {/* Action Buttons */}
                {isHovered && !isDragging && (
                    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                        <button
                            onClick={(e) => handleAction(e, onAddSubcategory)}
                            className={`p-1 rounded hover:bg-muted transition-colors ${isSelected ? 'text-primary-foreground' : 'text-text-secondary'}`}
                            title="Add Subcategory"
                        >
                            <Icon name="PlusIcon" size={16} variant="outline" />
                        </button>
                        <button
                            onClick={(e) => handleAction(e, onEdit)}
                            className={`p-1 rounded hover:bg-muted transition-colors ${isSelected ? 'text-primary-foreground' : 'text-text-secondary'}`}
                            title="Edit Category"
                        >
                            <Icon name="PencilIcon" size={16} variant="outline" />
                        </button>
                        <button
                            onClick={(e) => handleAction(e, onArchive)}
                            className={`p-1 rounded hover:bg-muted transition-colors ${isSelected ? 'text-primary-foreground' : 'text-text-secondary'}`}
                            title={category?.isArchived ? 'Unarchive' : 'Archive'}
                        >
                            <Icon name="ArchiveBoxIcon" size={16} variant="outline" />
                        </button>
                        <button
                            onClick={(e) => handleAction(e, onDelete)}
                            className={`p-1 rounded hover:bg-error/10 transition-colors ${isSelected ? 'text-primary-foreground' : 'text-error'}`}
                            title="Delete Category"
                        >
                            <Icon name="TrashIcon" size={16} variant="outline" />
                        </button>
                    </div>
                )}
            </div>
            {/* Render Children */}
            {isExpanded && hasChildren && (
                <div className="mt-1">
                    {category?.children?.map((child) => (
                        <CategoryNode
                            key={child?.id}
                            category={child}
                            level={level + 1}
                            onSelect={onSelect}
                            selectedId={selectedId}
                            onExpand={onExpand}
                            expandedIds={expandedIds}
                            onDragStart={onDragStart}
                            onDragOver={onDragOver}
                            onDrop={onDrop}
                            onAddSubcategory={onAddSubcategory}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onArchive={onArchive}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

CategoryNode.propTypes = {
    category: PropTypes?.shape({
        id: PropTypes?.string?.isRequired,
        name: PropTypes?.string?.isRequired,
        subcategoryCount: PropTypes?.number,
        contentCount: PropTypes?.number,
        isArchived: PropTypes?.bool,
        children: PropTypes?.array
    })?.isRequired,
    level: PropTypes?.number,
    onSelect: PropTypes?.func?.isRequired,
    selectedId: PropTypes?.string,
    onExpand: PropTypes?.func?.isRequired,
    expandedIds: PropTypes?.array?.isRequired,
    onDragStart: PropTypes?.func?.isRequired,
    onDragOver: PropTypes?.func?.isRequired,
    onDrop: PropTypes?.func?.isRequired,
    onAddSubcategory: PropTypes?.func?.isRequired,
    onEdit: PropTypes?.func?.isRequired,
    onDelete: PropTypes?.func?.isRequired,
    onArchive: PropTypes?.func?.isRequired
};

export default CategoryNode;
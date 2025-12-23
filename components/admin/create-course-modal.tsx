"use client";

import React, { useState } from "react";
import { useEnhancedUser } from "@/contexts/EnhancedUserContext";
import apiClient from "@/lib/apiClient";
import { handleApiError } from "@/lib/errorHandler";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, X, Loader2, Plus, Tag } from "lucide-react";
import Image from "next/image";
import { uploadToCloudinary } from "@/services/cloudinary.service";

interface CreateCourseModalProps {
    open: boolean;
    onOpenChange: (_open: boolean) => void;
    onSuccess?: () => void;
}

interface CourseFormData {
    title: string;
    description: string;
    category: string;
    level: "Beginner" | "Intermediate" | "Advanced";
    price: string;
    language: "English" | "Tamil" | "Sinhala";
    thumbnail: string;
    prerequisites: string[];
    tags: string[];
}

export function CreateCourseModal({ open: isOpen, onOpenChange, onSuccess }: CreateCourseModalProps) {
    const { user } = useEnhancedUser();
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [formData, setFormData] = useState<CourseFormData>({
        title: "",
        description: "",
        category: "",
        level: "Beginner",
        price: "",
        language: "English",
        thumbnail: "",
        prerequisites: [],
        tags: [],
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [newPrerequisite, setNewPrerequisite] = useState("");
    const [newTag, setNewTag] = useState("");

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev: CourseFormData) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            toast.error("Image size should be less than 10MB");
            return;
        }

        setLoading(true);
        try {
            // Use the cloudinary service for direct upload
            const result = await uploadToCloudinary(file, {
                folder: "course-thumbnails",
                tags: ["course-thumbnail", "mr5-lms"]
            });

            if (result) {
                const imageUrl = result.secure_url;
                setImagePreview(imageUrl);
                setFormData((prev: CourseFormData) => ({
                    ...prev,
                    thumbnail: imageUrl,
                }));
                toast.success("Image uploaded to Cloudinary");
            } else {
                toast.error("Failed to upload image");
            }
        } catch (err: any) {
            const errorMessage = handleApiError(err, "Upload");
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const removeImage = () => {
        setImagePreview("");
        setFormData((prev) => ({ ...prev, thumbnail: "" }));
    };

    const addPrerequisite = () => {
        if (newPrerequisite.trim() && !formData.prerequisites.includes(newPrerequisite.trim())) {
            setFormData(prev => ({
                ...prev,
                prerequisites: [...prev.prerequisites, newPrerequisite.trim()]
            }));
            setNewPrerequisite("");
        }
    };

    const removePrerequisite = (prereq: string) => {
        setFormData(prev => ({
            ...prev,
            prerequisites: prev.prerequisites.filter(p => p !== prereq)
        }));
    };

    const addTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }));
            setNewTag("");
        }
    };

    const removeTag = (tag: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(t => t !== tag)
        }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) newErrors.title = "Title is required";
        if (!formData.description.trim()) newErrors.description = "Description is required";
        if (!formData.category) newErrors.category = "Category is required";
        if (!formData.level) newErrors.level = "Level is required";
        if (!formData.price || parseFloat(formData.price) < 0) newErrors.price = "Valid price is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            const courseData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                category: formData.category.trim(),
                level: formData.level,
                price: parseFloat(formData.price),
                language: formData.language,
                thumbnail: formData.thumbnail,
                prerequisites: formData.prerequisites,
                tags: formData.tags,
                teacher: user?.id, // Assign current admin as teacher
                isApproved: true, // Auto-approve admin-created courses
            };

            await apiClient.post("/api/courses", courseData);

            toast.success("Course created successfully!");

            // Reset form
            setFormData({
                title: "",
                description: "",
                category: "",
                level: "Beginner",
                price: "",
                language: "English",
                thumbnail: "",
                prerequisites: [],
                tags: [],
            });
            setImagePreview("");
            setNewPrerequisite("");
            setNewTag("");

            onOpenChange(false);
            onSuccess?.();
        } catch (err: any) {
            const errorMessage = handleApiError(err, "Create Course");
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        Create New Course
                    </DialogTitle>
                    <DialogDescription>
                        Fill in the details below to create a new course. All fields marked
                        with * are required.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">
                            Course Title <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="e.g., Introduction to Web Development"
                            required
                        />
                        {errors.title && <p className="text-destructive text-sm">{errors.title}</p>}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">
                            Description <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Describe what students will learn in this course..."
                            rows={4}
                            required
                        />
                        {errors.description && <p className="text-destructive text-sm">{errors.description}</p>}
                    </div>

                    {/* Category and Level */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">
                                Category <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                placeholder="e.g., Programming, Design, Business"
                                required
                            />
                            {errors.category && <p className="text-destructive text-sm">{errors.category}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="level">
                                Level <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={formData.level}
                                onValueChange={(value: any) =>
                                    setFormData((prev) => ({ ...prev, level: value }))
                                }
                            >
                                <SelectTrigger id="level">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Beginner">Beginner</SelectItem>
                                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                                    <SelectItem value="Advanced">Advanced</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.level && <p className="text-destructive text-sm">{errors.level}</p>}
                        </div>
                    </div>

                    {/* Prerequisites */}
                    <div className="space-y-2">
                        <Label>Prerequisites</Label>
                        <div className="flex gap-2">
                            <Input
                                value={newPrerequisite}
                                onChange={(e) => setNewPrerequisite(e.target.value)}
                                placeholder="Add a prerequisite (e.g., Basic HTML knowledge)"
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPrerequisite())}
                            />
                            <Button type="button" onClick={addPrerequisite} variant="outline" size="icon">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {formData.prerequisites.map((prereq, index) => (
                                <div key={index} className="flex items-center bg-secondary rounded-full px-3 py-1 text-sm">
                                    <span>{prereq}</span>
                                    <button
                                        type="button"
                                        onClick={() => removePrerequisite(prereq)}
                                        className="ml-2 text-muted-foreground hover:text-foreground"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <Label>Tags</Label>
                        <div className="flex gap-2">
                            <Input
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                placeholder="Add a tag (e.g., javascript, frontend)"
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                            />
                            <Button type="button" onClick={addTag} variant="outline" size="icon">
                                <Tag className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {formData.tags.map((tag, index) => (
                                <div key={index} className="flex items-center bg-primary/10 rounded-full px-3 py-1 text-sm">
                                    <span>{tag}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="ml-2 text-muted-foreground hover:text-foreground"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Price and Language */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">
                                Price ($) <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.price}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                required
                            />
                            {errors.price && <p className="text-destructive text-sm">{errors.price}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="language">
                                Language <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={formData.language}
                                onValueChange={(value: any) =>
                                    setFormData((prev) => ({ ...prev, language: value }))
                                }
                            >
                                <SelectTrigger id="language">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="English">English</SelectItem>
                                    <SelectItem value="Tamil">Tamil</SelectItem>
                                    <SelectItem value="Sinhala">Sinhala</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Thumbnail Upload */}
                    <div className="space-y-2">
                        <Label htmlFor="thumbnail">Course Thumbnail</Label>
                        {imagePreview ? (
                            <div className="relative w-full h-48 rounded-lg border-2 border-border overflow-hidden group">
                                <Image
                                    src={imagePreview}
                                    alt="Course thumbnail preview"
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover"
                                />
                                <Button
                                    type="button"
                                    onClick={removeImage}
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <label
                                htmlFor="thumbnail"
                                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                                    <p className="mb-2 text-sm text-muted-foreground">
                                        <span className="font-semibold">Click to upload</span> or
                                        drag and drop
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        PNG, JPG or WEBP (MAX. 10MB)
                                    </p>
                                </div>
                                <input
                                    id="thumbnail"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={loading}
                                />
                            </label>
                        )}
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Course"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
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
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface CreateCourseModalProps {
    open: boolean;
    onOpenChange: (isOpen: boolean) => void;
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
}

export function CreateCourseModal({
    open,
    onOpenChange,
    onSuccess,
}: CreateCourseModalProps) {
    const { user } = useAuth();
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
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5MB");
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setImagePreview(result);
            setFormData((prev) => ({ ...prev, thumbnail: result }));
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImagePreview("");
        setFormData((prev) => ({ ...prev, thumbnail: "" }));
    };

    const validateForm = (): boolean => {
        if (!formData.title.trim()) {
            toast.error("Please enter a course title");
            return false;
        }
        if (!formData.description.trim()) {
            toast.error("Please enter a course description");
            return false;
        }
        if (!formData.category.trim()) {
            toast.error("Please enter a course category");
            return false;
        }
        if (!formData.price || parseFloat(formData.price) < 0) {
            toast.error("Please enter a valid price");
            return false;
        }
        return true;
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
            });
            setImagePreview("");

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
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
                            Course Title <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="e.g., Introduction to Web Development"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">
                            Description <span className="text-red-500">*</span>
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
                    </div>

                    {/* Category and Level */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">
                                Category <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                placeholder="e.g., Programming, Design, Business"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="level">
                                Level <span className="text-red-500">*</span>
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
                        </div>
                    </div>

                    {/* Price and Language */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">
                                Price ($) <span className="text-red-500">*</span>
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
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="language">
                                Language <span className="text-red-500">*</span>
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
                                    className="object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="h-4 w-4" />
                                </button>
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
                                        PNG, JPG or WEBP (MAX. 5MB)
                                    </p>
                                </div>
                                <input
                                    id="thumbnail"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
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
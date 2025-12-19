"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { avatarSupportService } from "@/services/avatarSupport.service";

interface ToolCallLocal {
  tool: string;
  op: string;
  params: Record<string, any>;
  result?: Record<string, any>;
}

interface AvatarActionResponseLocal {
  action_id: string;
  timestamp: string;
  user_intent: string;
  spoken_reply: string;
  visual_reply: string;
  tool_calls: ToolCallLocal[];
  result_expected: {
    status: string;
    status_code: number;
    short_message: string;
  };
}

export function AvatarSupportAgent() {
  const [isLoading, setIsLoading] = useState(false);
  const [userIntent, setUserIntent] = useState("");
  const [toolCalls, setToolCalls] = useState<ToolCallLocal[]>([
    {
      tool: "LIVEKIT_TOOL",
      op: "start_session",
      params: {
        room_id: "support-room",
        user_name: "user123",
        voice_mode: "stereo",
        record: true
      }
    },
    {
      tool: "SUPPORT_TOOL",
      op: "create_ticket",
      params: {
        user_id: "user123",
        subject: "Technical Issue",
        description: "Having trouble with the platform",
        priority: "medium"
      }
    }
  ]);
  const [response, setResponse] = useState<AvatarActionResponseLocal | null>(null);

  const handleAddToolCall = () => {
    setToolCalls([
      ...toolCalls,
      {
        tool: "LIVEKIT_TOOL",
        op: "start_session",
        params: {}
      }
    ]);
  };

  const handleRemoveToolCall = (index: number) => {
    const newToolCalls = [...toolCalls];
    newToolCalls.splice(index, 1);
    setToolCalls(newToolCalls);
  };

  const handleToolChange = (index: number, field: string, value: any) => {
    const newToolCalls = [...toolCalls];
    if (field === "tool" || field === "op") {
      newToolCalls[index] = { ...newToolCalls[index], [field]: value };
    } else {
      newToolCalls[index].params = { ...newToolCalls[index].params, [field]: value };
    }
    setToolCalls(newToolCalls);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await avatarSupportService.executeAction({
        user_intent: userIntent,
        tool_calls: toolCalls
      });
      
      setResponse(res.data);
      
      toast.success("Avatar action executed successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to execute avatar action");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTest = async () => {
    setIsLoading(true);
    try {
        const res = await avatarSupportService.runTest();
        setResponse(res.data);
        
        toast.success("Test avatar action executed successfully");
    } catch (error) {
        console.error('Avatar test error:', error);
        toast.error("Failed to execute test avatar action");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Avatar Support Agent</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user-intent">User Intent</Label>
            <Input
              id="user-intent"
              value={userIntent}
              onChange={(e) => setUserIntent(e.target.value)}
              placeholder="Describe what you want the avatar to do"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Tool Calls</h3>
              <Button onClick={handleAddToolCall} variant="outline" size="sm">
                Add Tool Call
              </Button>
            </div>

            {toolCalls.map((toolCall, index) => (
              <Card key={index} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium">Tool Call #{index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveToolCall(index)}
                  >
                    Remove
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tool</Label>
                    <select
                      className="w-full p-2 border rounded"
                      value={toolCall.tool}
                      onChange={(e) => handleToolChange(index, "tool", e.target.value)}
                    >
                      <option value="LIVEKIT_TOOL">LIVEKIT_TOOL</option>
                      <option value="AVATAR_TOOL">AVATAR_TOOL</option>
                      <option value="SUPPORT_TOOL">SUPPORT_TOOL</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Operation</Label>
                    <Input
                      value={toolCall.op}
                      onChange={(e) => handleToolChange(index, "op", e.target.value)}
                      placeholder="Operation name"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label>Parameters (JSON)</Label>
                    <Textarea
                      value={JSON.stringify(toolCall.params, null, 2)}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          const newToolCalls = [...toolCalls];
                          newToolCalls[index].params = parsed;
                          setToolCalls(newToolCalls);
                        } catch (err) {
                          console.error('JSON parse error:', err);
                          // Invalid JSON, ignore
                        }
                      }}
                      rows={4}
                      placeholder='{"param1": "value1", "param2": "value2"}'
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Executing..." : "Execute Action"}
            </Button>
            <Button onClick={handleTest} variant="secondary" disabled={isLoading}>
              Run Test
            </Button>
          </div>
        </CardContent>
      </Card>

      {response && (
        <Card>
          <CardHeader>
            <CardTitle>Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Spoken Reply:</h3>
                <p className="text-muted-foreground">{response.spoken_reply}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Visual Reply:</h3>
                <p className="text-muted-foreground">{response.visual_reply}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Tool Calls Results:</h3>
                <div className="space-y-2">
                  {response.tool_calls.map((call, index) => (
                    <div key={index} className="p-3 bg-muted rounded">
                      <div className="font-medium">{call.tool}.{call.op}</div>
                      <div className="text-sm text-muted-foreground">
                        Status: {call.result?.status} ({call.result?.status_code})
                      </div>
                      <div className="text-sm">
                        Message: {call.result?.short_message}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
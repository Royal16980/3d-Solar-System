"use client";

import type { UserContent } from "ai";
import { useEveAgent } from "eve/react";
import { AlertCircleIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  PromptInput,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { extractLatestSceneCommand, type SceneCommand } from "@/lib/scene-commands";
import { cn } from "@/lib/utils";
import { AgentMessage } from "./agent-message";

const AGENT_NAME = "Solar system guide";

const STARTERS = [
  "Give me a short tour",
  "Show me Saturn",
  "Compare Earth and Mars",
] as const;

type AgentStatus = ReturnType<typeof useEveAgent>["status"];

export type AgentClientContext = {
  readonly focusedBody: string;
  readonly orbitSpeed: number;
};

export function AgentChat({
  clientContext,
  onSceneCommand,
  variant = "page",
}: {
  readonly clientContext?: AgentClientContext;
  readonly onSceneCommand?: (command: SceneCommand) => void;
  readonly variant?: "page" | "panel";
}) {
  const [cancellationError, setCancellationError] = useState<string>();
  const lastCommandId = useRef<string | undefined>(undefined);
  const agent = useEveAgent({
    prepareSend: (input) => ({
      ...input,
      clientContext,
    }),
  });
  const isBusy = agent.status === "submitted" || agent.status === "streaming";
  const isEmpty = agent.data.messages.length === 0;
  const errorMessage = cancellationError ?? agent.error?.message;
  const isPanel = variant === "panel";

  useEffect(() => {
    const command = extractLatestSceneCommand(agent.data.messages);
    if (!command || command.toolCallId === lastCommandId.current) {
      return;
    }
    lastCommandId.current = command.toolCallId;
    onSceneCommand?.(command);
  }, [agent.data.messages, onSceneCommand]);

  const requestCancellation = () => {
    setCancellationError(undefined);
    void agent.cancel().catch((error: unknown) => {
      setCancellationError(toErrorMessage(error));
    });
  };

  const handleSubmit = async (message: PromptInputMessage) => {
    const text = message.text.trim();
    if ((text.length === 0 && message.files.length === 0) || isBusy) return;

    setCancellationError(undefined);

    if (message.files.length === 0) {
      await agent.send(text);
      return;
    }

    const parts: UserContent = [];
    if (text.length > 0) {
      parts.push({ text, type: "text" });
    }
    for (const file of message.files) {
      parts.push({
        data: file.url,
        filename: file.filename,
        mediaType: file.mediaType,
        type: "file",
      });
    }

    await agent.send(parts);
  };

  const composer = (
    <PromptInput onSubmit={handleSubmit}>
      <PromptInputTextarea placeholder="Ask about a planet…" />
      <PromptInputSubmit onStop={requestCancellation} status={agent.status} />
    </PromptInput>
  );

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden bg-background text-foreground",
        isPanel ? "h-full bg-transparent" : "h-dvh",
      )}
    >
      {isEmpty && !isPanel ? null : (
        <header className="flex h-14 shrink-0 items-center justify-center gap-3 pl-4 pr-2">
          <span className="flex min-w-0 items-center gap-2">
            <span className="truncate text-muted-foreground text-sm">{AGENT_NAME}</span>
            <StatusDot status={agent.status} />
          </span>
        </header>
      )}

      {errorMessage ? (
        <div className="mx-auto w-full max-w-3xl shrink-0 px-4 pt-2 sm:px-6">
          <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm">
            <AlertCircleIcon className="mt-0.5 size-4 shrink-0 text-destructive" />
            <div>
              <p className="font-medium">Request failed</p>
              <p className="mt-0.5 text-muted-foreground">{errorMessage}</p>
              {errorMessage.includes("credentials") ? (
                <p className="mt-1 text-muted-foreground text-xs">
                  Set AI_GATEWAY_API_KEY in .env.local, or run eve link.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {isEmpty ? null : (
        <Conversation className="min-h-0 flex-1">
          <ConversationContent className="mx-auto w-full max-w-3xl gap-6 px-4 py-6 sm:px-6">
            {agent.data.messages.map((message, index) => (
              <AgentMessage
                canRespond={!isBusy}
                isStreaming={
                  agent.status === "streaming" && index === agent.data.messages.length - 1
                }
                key={message.id}
                message={message}
                onInputResponses={(inputResponses) => {
                  setCancellationError(undefined);
                  return agent.respond(inputResponses);
                }}
              />
            ))}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      )}

      <div
        className={cn(
          "mx-auto w-full px-4 sm:px-6",
          isEmpty
            ? cn(
                "flex max-w-xl flex-1 flex-col items-center",
                isPanel ? "justify-end gap-4 pb-4" : "justify-center gap-8 pb-[10vh]",
              )
            : "max-w-3xl shrink-0 pb-6",
        )}
      >
        {isEmpty ? (
          <div className={cn("flex w-full flex-col items-center gap-3 text-center", isPanel && "gap-2")}>
            {isPanel ? null : (
              <h1 className="font-medium text-5xl tracking-tighter">{AGENT_NAME}</h1>
            )}
            {isPanel ? (
              <p className="max-w-sm text-muted-foreground text-sm">
                Ask for a tour, or tell me which planet to show.
              </p>
            ) : null}
            <div className={cn("flex w-full gap-2", isPanel ? "flex-col" : "flex-wrap justify-center")}>
              {STARTERS.map((starter) => (
                <button
                  className={cn(
                    "rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-left text-slate-100 text-xs transition-colors hover:bg-white/20 disabled:opacity-50",
                    isPanel && "w-full",
                  )}
                  disabled={isBusy}
                  key={starter}
                  onClick={() => {
                    setCancellationError(undefined);
                    void agent.send(starter);
                  }}
                  type="button"
                >
                  {starter}
                </button>
              ))}
            </div>
          </div>
        ) : null}
        <div className="w-full">{composer}</div>
      </div>
    </div>
  );
}

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unable to cancel the response.";
}

function StatusDot({ status }: { readonly status: AgentStatus }) {
  const isLive = status === "submitted" || status === "streaming";
  const tone =
    status === "error"
      ? "bg-destructive"
      : isLive
        ? "bg-emerald-500"
        : status === "ready"
          ? "bg-muted-foreground"
          : "bg-muted-foreground/50";

  return (
    <span className="relative flex size-1">
      {isLive ? (
        <span
          className={cn(
            "absolute inline-flex size-full animate-ping rounded-full opacity-75",
            tone,
          )}
        />
      ) : null}
      <span className={cn("relative inline-flex size-1 rounded-full transition-colors", tone)} />
    </span>
  );
}

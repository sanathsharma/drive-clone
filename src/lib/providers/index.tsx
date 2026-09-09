import { NextIntlClientProvider } from "next-intl";
import { Toaster } from "@/components/ui/toast";
import { Provider as QueryClientProvider } from "@/lib/queryClient";
import { buildProvidersTree } from "./build-providers-tree";

export const Providers = buildProvidersTree([[NextIntlClientProvider], [QueryClientProvider], [Toaster]]);

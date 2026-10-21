import { PROPERTIES } from './data/properties';
import { Project, AssistantChatMessage } from './types';
import { parseCurrencyQuery, formatIndianCurrency } from './calculator';

export interface AssistantResponse {
  reply: string;
  recommendedProjects: Project[];
  suggestedFollowUps: string[];
  isDeterministicFallback: boolean;
}

/**
 * Deterministic Natural Language property matcher grounded strictly in PROPERTIES catalogue.
 */
export function matchPropertiesFromQuery(query: string): AssistantResponse {
  const lower = query.toLowerCase();

  // 1. Detect City
  let targetCity: string | null = null;
  if (lower.includes('chennai') || lower.includes('madras')) {
    targetCity = 'Chennai';
  } else if (lower.includes('coimbatore') || lower.includes('kovai')) {
    targetCity = 'Coimbatore';
  } else if (lower.includes('bengaluru') || lower.includes('bangalore')) {
    targetCity = 'Bengaluru';
  }

  // 2. Detect BHK
  let targetBhk: number | null = null;
  const bhkMatch = lower.match(/(\d+)\s*bhk/);
  if (bhkMatch) {
    targetBhk = parseInt(bhkMatch[1], 10);
  } else if (lower.includes('penthouse') || lower.includes('duplex')) {
    targetBhk = 5;
  } else if (lower.includes('villa')) {
    targetBhk = 3;
  }

  // 3. Detect Budget Cap (e.g. "under 80 lakh", "below 1.5 cr", "less than 3 crore")
  const budgetCap = parseCurrencyQuery(lower);

  // 4. Detect Status preference
  const wantsReadyToMove = lower.includes('ready to move') || lower.includes('ready') || lower.includes('immediate');
  const wantsNewLaunch = lower.includes('new launch') || lower.includes('upcoming');

  // 5. Detect Lifestyle keywords
  const wantsSeaView = lower.includes('sea') || lower.includes('ocean') || lower.includes('beach') || lower.includes('ecr');
  const wantsUltraLuxury = lower.includes('ultra luxury') || lower.includes('boat club') || lower.includes('exclusive') || lower.includes('palatial');
  const wantsITLocation = lower.includes('omr') || lower.includes('whitefield') || lower.includes('tech') || lower.includes('it corridor');

  // Filter projects strictly against catalog
  const matches = PROPERTIES.filter((project) => {
    // City match
    if (targetCity && project.city.toLowerCase() !== targetCity.toLowerCase()) {
      return false;
    }

    // BHK match
    if (targetBhk !== null) {
      const hasBhk = project.configurations.some((c) => c.bhk === targetBhk);
      if (!hasBhk) return false;
    }

    // Budget check
    if (budgetCap !== null) {
      // Find if any configuration is within budget, or starting price <= budgetCap * 1.15
      const hasConfigUnderBudget = project.configurations.some((c) => c.indicativePrice <= budgetCap);
      if (!hasConfigUnderBudget && project.startingPrice > budgetCap * 1.1) {
        return false;
      }
    }

    // Status preference
    if (wantsReadyToMove && project.status !== 'Ready to Move') {
      return false;
    }
    if (wantsNewLaunch && project.status !== 'New Launch') {
      return false;
    }

    // Lifestyle tags
    if (wantsSeaView && !project.locality.toLowerCase().includes('ecr') && !project.name.toLowerCase().includes('marina')) {
      return false;
    }
    if (wantsUltraLuxury && project.startingPrice < 25000000) {
      return false;
    }

    return true;
  });

  // If strict filtering returned nothing, let's relax non-critical constraints
  let finalMatches = matches;
  if (finalMatches.length === 0 && (targetCity || budgetCap || targetBhk)) {
    finalMatches = PROPERTIES.filter((p) => {
      let score = 0;
      if (targetCity && p.city.toLowerCase() === targetCity.toLowerCase()) score += 2;
      if (targetBhk && p.configurations.some((c) => c.bhk === targetBhk)) score += 2;
      if (budgetCap && p.startingPrice <= budgetCap * 1.25) score += 2;
      return score >= 2;
    });
  }

  // Generate grounded explanation
  let reply = '';
  let followUps: string[] = [];

  if (finalMatches.length > 0) {
    const primary = finalMatches[0];
    const matchingConfigs = targetBhk
      ? primary.configurations.filter((c) => c.bhk === targetBhk)
      : primary.configurations;

    const configText = matchingConfigs.length > 0
      ? matchingConfigs.map((c) => `${c.type} (${c.carpetAreaSqFt} sq.ft carpet, starting at ${c.priceDisplay})`).join(', ')
      : `${primary.configurations.map((c) => c.type).join(', ')}`;

    reply = `I found **${finalMatches.length} verified project${finalMatches.length > 1 ? 's' : ''}** matching your criteria in our Tamil Nadu portfolio:\n\n` +
      `**${primary.name}** in ${primary.locality}, ${primary.city}.\n` +
      `• **Configurations**: ${configText}\n` +
      `• **Status**: ${primary.status} (${primary.possessionDate})\n` +
      `• **Key Highlights**: ${primary.amenities.slice(0, 3).join(', ')}\n` +
      `• **RERA Registered**: ${primary.reraId}\n\n` +
      `Would you like to schedule an accompanied site visit, view the architectural floor plan, or connect with our senior relationship manager?`;

    followUps = [
      `Book a site visit for ${primary.name}`,
      `Show full floor plans for ${primary.name}`,
      `Connect with Property Advisor on WhatsApp`,
      `Show ready to move homes in Chennai`,
    ];
  } else {
    reply = `We do not currently have an exact verified project matching all your specific parameters (${targetCity || 'any city'}, ${targetBhk ? targetBhk + ' BHK' : ''} ${budgetCap ? 'under ' + formatIndianCurrency(budgetCap) : ''}).\n\n` +
      `To protect your interests, HomeFinder AI never invents inventory or pricing. Would you like to explore our nearest luxury residences or speak directly with our acquisitions advisory team?`;

    followUps = [
      'Show all Chennai luxury projects',
      'Show ready-to-move projects',
      'Connect with Property Advisor',
      'View projects under ₹1.5 Cr',
    ];
  }

  return {
    reply,
    recommendedProjects: finalMatches,
    suggestedFollowUps: followUps,
    isDeterministicFallback: true,
  };
}

/**
 * Server-backed AI Assistant with seamless client fallback
 */
export async function sendAssistantMessage(
  query: string,
  history: AssistantChatMessage[] = []
): Promise<AssistantResponse> {
  try {
    const res = await fetch('/api/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        history: history.slice(-6).map((m) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          content: m.content,
        })),
        propertiesCatalogue: PROPERTIES.map((p) => ({
          id: p.id,
          name: p.name,
          city: p.city,
          locality: p.locality,
          startingPrice: p.startingPrice,
          startingPriceDisplay: p.startingPriceDisplay,
          status: p.status,
          possessionDate: p.possessionDate,
          reraId: p.reraId,
          configurations: p.configurations.map((c) => ({
            bhk: c.bhk,
            type: c.type,
            carpetArea: c.carpetAreaSqFt,
            price: c.priceDisplay,
          })),
          amenities: p.amenities,
        })),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.reply) {
        // Map recommended project IDs to actual Project objects
        const recProjects = (data.recommendedProjectIds || [])
          .map((id: string) => PROPERTIES.find((p) => p.id === id))
          .filter(Boolean) as Project[];

        return {
          reply: data.reply,
          recommendedProjects: recProjects.length > 0 ? recProjects : matchPropertiesFromQuery(query).recommendedProjects,
          suggestedFollowUps: data.suggestedFollowUps || [
            'Book a site visit',
            'View floor plans',
            'Connect with Advisor',
          ],
          isDeterministicFallback: false,
        };
      }
    }
  } catch {
    // API route not reachable or error, fall through to deterministic matcher
  }

  // Deterministic catalog-grounded fallback
  return matchPropertiesFromQuery(query);
}

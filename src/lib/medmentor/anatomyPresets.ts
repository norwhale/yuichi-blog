/**
 * Registry of neuroanatomy preset SVGs bundled with MedMentor.
 * New presets: drop SVG in /public/medmentor/anatomy/ and add an entry here.
 *
 * The model is told about this list so it can reference presets by id
 * inside answers — e.g. `{{anatomy:neuron}}` — instead of hand-drawing ASCII.
 */
export const ANATOMY_PRESETS = {
  neuron: {
    label: "Neuron (dendrites → soma → axon → terminals)",
    path: "/medmentor/anatomy/neuron.svg",
  },
  "action-potential": {
    label: "Action potential waveform (resting → depol → repol → AHP)",
    path: "/medmentor/anatomy/action-potential.svg",
  },
  synapse: {
    label: "Chemical synapse (vesicles, cleft, receptors)",
    path: "/medmentor/anatomy/synapse.svg",
  },
  "brain-lobes": {
    label: "Brain lobes — lateral view (frontal/parietal/temporal/occipital)",
    path: "/medmentor/anatomy/brain-lobes.svg",
  },
  "eeg-10-20": {
    label: "EEG 10-20 system electrode placement (top-down)",
    path: "/medmentor/anatomy/eeg-10-20.svg",
  },
} as const;

export type AnatomyPresetId = keyof typeof ANATOMY_PRESETS;

export function isAnatomyPresetId(id: string): id is AnatomyPresetId {
  return Object.prototype.hasOwnProperty.call(ANATOMY_PRESETS, id);
}

/** For prompt injection: short bulleted list the model can pick from. */
export function buildAnatomyPresetsList(): string {
  return Object.entries(ANATOMY_PRESETS)
    .map(([id, { label }]) => `  - \`{{anatomy:${id}}}\` — ${label}`)
    .join("\n");
}

import { frameLoader } from '../embeds/frames';
import renderGraphic from './graphic';

// This JS pack is included by default, so our graphics can be wrapped in AMP-compatible iframes
// renderGraphic() renders a coded graphic on resize
frameLoader(renderGraphic);

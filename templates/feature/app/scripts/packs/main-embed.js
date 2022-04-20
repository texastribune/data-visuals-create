import { frameLoader } from '../embeds/frames';
import renderGraphic from './graphic-embed';

// included in index.html by default
// initiates frame so your graphic is wrapped in an AMP-compatible iframe
// renderGraphic() renders a coded graphic on load and on resize
frameLoader(renderGraphic);

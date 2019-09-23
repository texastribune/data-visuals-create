import { frameLoader } from '../embeds/frames';
import renderGraphic from './graphic';

// index.html includes this pack by default
// initiates frame so your graphic is wrapped in an AMP-compatible iframe
// renderGraphic() renders a coded graphic on load and on resize
frameLoader(renderGraphic);

/**
 * DOM Patch for removeChild bug in cmdk with React 18
 * This patch must run before React and cmdk are loaded
 */

// Store the original removeChild
const originalRemoveChild = Element.prototype.removeChild;
const originalRemoveChildNode = Node.prototype.removeChild;

// Create a safe wrapper
function safeRemoveChild(child: Node) {
  try {
    // Check if child is actually a child of this node
    if (this.contains(child) || this === child.parentNode) {
      return originalRemoveChild.call(this, child);
    } else {
      // Child is not actually a child, return it anyway to prevent error
      return child;
    }
  } catch (error) {
    // If removeChild fails, return the child node instead of throwing
    return child;
  }
}

// Patch both Element and Node prototypes
Element.prototype.removeChild = safeRemoveChild as any;
Node.prototype.removeChild = safeRemoveChild as any;

// Also patch console.error to suppress these specific errors
const originalConsoleError = console.error;
(console as any).error = function(...args: any[]) {
  const message = args[0]?.toString?.() || '';
  
  // Suppress removeChild errors
  if (
    message.includes('removeChild') &&
    message.includes('not a child of this node')
  ) {
    return; // Silently ignore
  }
  
  // Call original for all other errors
  originalConsoleError.apply(console, args);
};

// Suppress unhandled errors
window.addEventListener('error', (event) => {
  if (
    event.error?.message?.includes('removeChild') &&
    event.error?.message?.includes('not a child')
  ) {
    event.preventDefault();
  }
}, true);

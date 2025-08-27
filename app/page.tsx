import Link from "next/link";
import "./app.css";

export default function HomePage() {
  const testRoutes = [
    {
      path: "/region",
      title: "Regional Detection",
      description: "IP-to-region mapping service - detects user location"
    },
    {
      path: "/contextMenu", 
      title: "Context Menu Testing",
      description: "Right-click context menu functionality testing"
    },
    {
      path: "/jsdialogs",
      title: "JavaScript Dialogs",
      description: "Native browser dialogs (alert, prompt, confirm)"
    },
    {
      path: "/ttfb/1000",
      title: "TTFB Testing",
      description: "Time To First Byte simulation with configurable delay"
    },
    {
      path: "/resptime/2000", 
      title: "Response Time Testing",
      description: "Response time simulation with configurable delay"
    },
    {
      path: "/domload/1500",
      title: "DOM Load Testing", 
      description: "Delayed DOM loading simulation"
    },
    {
      path: "/enterWord",
      title: "Word Entry",
      description: "Add words to in-memory list"
    },
    {
      path: "/iframeform",
      title: "iFrame Form Testing",
      description: "Forms within iframes testing"
    },
    {
      path: "/clickForNewTab",
      title: "New Tab Testing",
      description: "Browser tab management and new tab functionality"
    },
    {
      path: "/500error",
      title: "HTTP 500 Error Testing", 
      description: "HTTP error simulation and handling"
    },
    {
      path: "/tastetheload.svg",
      title: "Static Asset Testing",
      description: "SVG image serving functionality test"
    }
  ];

  return (
    <main style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>HTML Feature Testing Website</h1>
      <p>
        This website demonstrates various HTML features, browser capabilities, 
        and HTTP responses for testing purposes.
      </p>
      
      <div style={{ marginTop: "2rem" }}>
        <h2>Available Test Routes</h2>
        <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
          {testRoutes.map((route) => (
            <div 
              key={route.path}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px", 
                padding: "1rem",
                backgroundColor: "#f9f9f9"
              }}
            >
              <h3>
                <Link 
                  href={route.path}
                  style={{ 
                    textDecoration: "none", 
                    color: "#0070f3",
                    fontSize: "1.1rem"
                  }}
                >
                  {route.title}
                </Link>
              </h3>
              <p style={{ margin: "0.5rem 0 0 0", color: "#666" }}>
                {route.description}
              </p>
              <code style={{ 
                fontSize: "0.9rem", 
                backgroundColor: "#eee", 
                padding: "0.2rem 0.4rem",
                borderRadius: "3px"
              }}>
                {route.path}
              </code>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "3rem", padding: "1rem", backgroundColor: "#f0f8ff", borderRadius: "8px" }}>
        <h3>API Endpoints</h3>
        <ul>
          <li><code>GET /api/region</code> - IP geolocation detection</li>
          <li><code>POST /api/addWord</code> - Add word to memory list</li>
          <li><code>GET /api/resetWordList</code> - Reset word list</li>
          <li><code>GET /api/ttfb/{"{delay}"}</code> - TTFB with delay</li>
          <li><code>GET /api/resptime/{"{delay}"}</code> - Response time simulation</li>
          <li><code>GET /api/domload/{"{delay}"}</code> - DOM load delay</li>
        </ul>
      </div>
    </main>
  );
}

"use client";

import { type ReactNode, useEffect } from "react";
import styles from "./synex.module.css";

function cn(...classNames: Array<string | false | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

function BrowserFrame({ children }: { children: ReactNode }) {
  return (
    <div className={styles["browser-frame"]}>
      <div className={styles["browser-topbar"]}>
        <div className={styles["browser-left"]}>
          <span className={cn(styles["browser-dot"], styles["dot-red"])} />
          <span className={cn(styles["browser-dot"], styles["dot-yellow"])} />
          <span className={cn(styles["browser-dot"], styles["dot-green"])} />
          <span className={styles["browser-icon"]}>&#8962;</span>
          <span className={styles["browser-icon"]}>&#8249;</span>
          <span className={styles["browser-icon"]}>&#8250;</span>
        </div>

        <div className={styles["browser-address"]}>&#128274; synex.xyz/home</div>

        <div className={styles["browser-right"]}>
          <span className={styles["browser-icon"]}>&#8635;</span>
          <span className={styles["browser-icon"]}>&#8679;</span>
          <span className={styles["browser-icon"]}>+</span>
          <span className={styles["browser-icon"]}>&#9633;</span>
        </div>
      </div>

      {children}
    </div>
  );
}

function SynexHeader({
  dark = false,
  showRequestAccess = false,
}: {
  dark?: boolean;
  showRequestAccess?: boolean;
}) {
  return (
    <header
      className={cn(
        styles["site-header"],
        dark && styles["site-header-dark"],
      )}
    >
      <div className={styles.logo}>synex</div>

      <nav className={styles["site-nav"]}>
        <a href="#hero">DASHBOARD</a>
        <a href="#features">ASSETS</a>
        <a href="#signal">ANALYTICS</a>
        <a href="#compare">MARKETS</a>
      </nav>

      <div className={styles["site-actions"]}>
        <span className={styles.language}>&#9679; English</span>
        {showRequestAccess ? (
          <a className={cn(styles.pill, styles["pill-muted"])} href="#compare">
            Request access
          </a>
        ) : null}
        <a
          className={cn(
            styles.pill,
            dark ? styles["pill-light"] : styles["pill-dark"],
          )}
          href="#compare"
        >
          Launch app
        </a>
      </div>
    </header>
  );
}

export default function SynexPage() {
  useEffect(() => {
    const scenes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-synex-scene]"),
    );

    if (scenes.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles["is-visible"]);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    scenes.slice(1).forEach((scene) => observer.observe(scene));

    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.pageShell}>
      <div className={styles.ambient} aria-hidden="true">
        <div className={styles["ambient-stones"]}>
          <span className={cn(styles.stone, styles["stone-a"])} />
          <span className={cn(styles.stone, styles["stone-b"])} />
          <span className={cn(styles.stone, styles["stone-c"])} />
          <span className={cn(styles.stone, styles["stone-d"])} />
          <span className={cn(styles.stone, styles["stone-e"])} />
          <span className={cn(styles.stone, styles["stone-f"])} />
        </div>
      </div>

      <main className={styles["synex-page"]}>
        <section
          id="hero"
          data-synex-scene
          className={cn(
            styles.scene,
            styles.reveal,
            styles["is-visible"],
          )}
        >
          <BrowserFrame>
            <div className={cn(styles["site-panel"], styles["site-panel-light"])}>
              <SynexHeader />

              <div className={styles["hero-copy"]}>
                <p className={styles.eyebrow}>FINANCE REIMAGINED</p>
                <h1>
                  <span>A New Standard</span>
                  <strong>in Wealth Management</strong>
                </h1>
                <p className={styles.subcopy}>
                  Take full control of your assets with a unified platform for
                  investing, tracking, and growing your portfolio in real time.
                </p>
              </div>

              <div className={styles["hero-dashboard"]}>
                <aside className={styles["dashboard-sidebar"]}>
                  <div className={styles["sidebar-profile"]}>
                    <span className={styles["profile-avatar"]} />
                    <div>
                      <strong>Antoine</strong>
                      <small>Wealth Admin</small>
                    </div>
                  </div>

                  <div className={styles["sidebar-search"]}>Search</div>

                  <ul className={styles["sidebar-nav"]}>
                    <li>Dashboard</li>
                    <li>Analytics Subscriptions</li>
                    <li>Safe List</li>
                    <li>Goals</li>
                    <li>Monthly Reports</li>
                    <li>Quarterly Goals</li>
                    <li>Risk Projection</li>
                  </ul>

                  <div className={styles["sidebar-footer"]}>
                    <span>My Reports</span>
                    <small>View Reports</small>
                  </div>
                </aside>

                <div className={styles["dashboard-main"]}>
                  <div className={styles["dashboard-meta"]}>
                    <div className={styles.advisor}>
                      <span
                        className={cn(
                          styles["profile-avatar"],
                          styles["avatar-dark"],
                        )}
                      />
                      <div>
                        <small>Presented by</small>
                        <strong>Ronald Finch</strong>
                      </div>
                    </div>

                    <div className={styles["meta-pills"]}>
                      <span className={styles["toggle-pill"]}>Turbo</span>
                      <span>Oct 10, 2024</span>
                      <span>Sat, 18 June</span>
                    </div>
                  </div>

                  <div className={styles["capital-block"]}>
                    <small>CAPITAL UNDER CONTROL</small>
                    <div className={styles["capital-line"]}>
                      <strong>$ 345,398.34</strong>
                      <span>24.2%</span>
                      <span>YTD GROWTH</span>
                    </div>
                  </div>

                  <div className={styles["metric-row"]}>
                    <div>
                      <strong>$28,500</strong>
                      <small>Premium</small>
                    </div>
                    <div>
                      <strong>$35,200</strong>
                      <small>Equities</small>
                    </div>
                    <div>
                      <strong>$24,300</strong>
                      <small>Liquidity</small>
                    </div>
                  </div>

                  <div className={styles["chart-grid"]}>
                    <div className={styles["chart-block"]}>
                      <div className={cn(styles.bars, styles["bars-tall"])} />
                    </div>
                    <div className={styles["chart-block"]}>
                      <div className={cn(styles.bars, styles["bars-wide"])} />
                    </div>
                    <div className={styles["chart-block"]}>
                      <div className={cn(styles.bars, styles["bars-short"])} />
                    </div>
                  </div>

                  <div className={styles["mini-grid"]}>
                    <span>Position Entry</span>
                    <span>$2.00</span>
                    <span>Position Entry</span>
                    <span>$2.00</span>
                    <span>Position Entry</span>
                    <span>$2.00</span>
                  </div>
                </div>
              </div>

              <div className={cn(styles["hero-rock"], styles["left-rock"])}>
                <div className={cn(styles.moss, styles["moss-soft"])} />
              </div>

              <div className={cn(styles["hero-rock"], styles["right-rock"])}>
                <div className={cn(styles.moss, styles["moss-bright"])} />
                <div className={styles.flowers} />
              </div>

              <div className={styles["scroll-note"]}>Scroll to explore</div>
            </div>
          </BrowserFrame>
        </section>

        <section
          id="features"
          data-synex-scene
          className={cn(styles.scene, styles.reveal)}
        >
          <BrowserFrame>
            <div
              className={cn(
                styles["site-panel"],
                styles["site-panel-dark-top"],
              )}
            >
              <SynexHeader dark showRequestAccess />

              <div className={styles["feature-head"]}>
                <div>
                  <h2>
                    Clarity and control for every
                    <br />
                    part of your portfolio
                  </h2>
                </div>
                <p>
                  Get a clear, structured view of your capital from asset
                  allocation to performance insights and future opportunities.
                </p>
              </div>

              <div className={styles["feature-grid"]}>
                <article className={styles["feature-card"]}>
                  <div className={styles["feature-copy"]}>
                    <span>[1]</span>
                    <h3>Total asset visibility</h3>
                    <p>
                      Every position, every movement, clearly structured in one
                      system. Get a unified view of your entire portfolio across
                      all assets and accounts.
                    </p>
                  </div>

                  <div
                    className={cn(
                      styles["feature-art"],
                      styles["feature-art-blue"],
                    )}
                  >
                    <div
                      className={cn(
                        styles["glass-card"],
                        styles["glass-card-blue"],
                      )}
                    >
                      <div className={styles["glass-label"]}>
                        Portfolio Overview
                      </div>
                      <div className={styles["glass-stats"]}>
                        <span>$35,200</span>
                        <span>+3,567.99</span>
                        <span>28</span>
                      </div>
                      <div
                        className={cn(
                          styles["mini-chart"],
                          styles["mini-chart-bars"],
                        )}
                      />
                      <div className={styles["glass-lines"]}>
                        <span>Stock</span>
                        <span>$105.00</span>
                        <span>Crypto</span>
                        <span>$53.00</span>
                        <span>Cash</span>
                        <span>$23.00</span>
                      </div>
                    </div>
                  </div>
                </article>

                <article className={styles["feature-card"]}>
                  <div className={styles["feature-copy"]}>
                    <span>[2]</span>
                    <h3>Precision performance tracking</h3>
                    <p>
                      Advanced analytics to monitor growth, volatility, and
                      efficiency. Analyze performance with deeper insights across
                      timeframes.
                    </p>
                  </div>

                  <div
                    className={cn(
                      styles["feature-art"],
                      styles["feature-art-green"],
                    )}
                  >
                    <div
                      className={cn(
                        styles["glass-card"],
                        styles["glass-card-dark"],
                      )}
                    >
                      <div className={styles["glass-label"]}>Performance</div>
                      <div className={styles["performance-number"]}>27.4%</div>
                      <div className={styles["performance-copy"]}>
                        Precision Data Insights
                      </div>
                      <p>
                        Evaluate market volatility and performance drivers with
                        deep-dive analytics.
                      </p>
                      <div className={styles["performance-metrics"]}>
                        <div>
                          <small>Growth</small>
                          <strong>+12%</strong>
                        </div>
                        <div>
                          <small>Volatility Ratio</small>
                          <strong>-3.1</strong>
                        </div>
                        <div>
                          <small>Efficiency Ratio</small>
                          <strong>+8%</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>

                <article className={styles["feature-card"]}>
                  <div className={styles["feature-copy"]}>
                    <span>[3]</span>
                    <h3>Global allocation intelligence</h3>
                    <p>
                      Real-time global capital distribution and opportunity
                      mapping. Track flows, regional exposure, and emerging
                      opportunities all in one view.
                    </p>
                  </div>

                  <div
                    className={cn(
                      styles["feature-art"],
                      styles["feature-art-sand"],
                    )}
                  >
                    <div
                      className={cn(
                        styles["glass-card"],
                        styles["glass-card-sand"],
                      )}
                    >
                      <div className={styles["glass-label"]}>
                        Global capital flow
                      </div>
                      <div className={styles["world-money"]}>$ 52,480,000</div>
                      <div className={styles["world-map"]} />
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </BrowserFrame>
        </section>

        <section
          id="signal"
          data-synex-scene
          className={cn(styles.scene, styles.reveal)}
        >
          <BrowserFrame>
            <div
              className={cn(
                styles["site-panel"],
                styles["site-panel-light"],
                styles["branch-stage"],
              )}
            >
              <SynexHeader dark showRequestAccess />

              <div className={styles["branch-line"]}>
                <div className={styles["branch-wood"]} />
                <div className={styles["branch-moss"]} />
              </div>

              <div className={styles["signal-card"]}>
                <div className={styles["signal-glow"]} />
                <div className={styles["signal-inner"]}>
                  <div className={styles["signal-title"]}>
                    Portfolio signal strength
                  </div>
                  <div className={styles["signal-track"]}>
                    <span
                      className={cn(
                        styles["signal-node"],
                        styles.active,
                      )}
                    />
                    <span className={styles["signal-node"]} />
                    <span className={styles["signal-node"]} />
                    <span
                      className={cn(
                        styles["signal-node"],
                        styles.active,
                      )}
                    />
                  </div>
                  <div className={styles["signal-badge"]}>87</div>
                  <ul>
                    <li>High volatility</li>
                    <li>Rebalance exposure</li>
                  </ul>
                </div>
              </div>

              <div
                className={cn(
                  styles["floating-note"],
                  styles["note-opportunity"],
                )}
              >
                <strong>+$12,840</strong>
                <span>Captured opportunity</span>
                <button type="button">View insight</button>
              </div>

              <div
                className={cn(styles["floating-note"], styles["note-risk"])}
              >
                <small>Risk alert</small>
                <span>High volatility detected in emerging markets</span>
              </div>
            </div>
          </BrowserFrame>
        </section>

        <section
          id="compare"
          data-synex-scene
          className={cn(styles.scene, styles.reveal)}
        >
          <BrowserFrame>
            <div
              className={cn(
                styles["site-panel"],
                styles["site-panel-compare"],
              )}
            >
              <SynexHeader dark showRequestAccess />

              <div className={styles["compare-copy"]}>
                <p className={styles.eyebrow}>WHY SYNEX</p>
                <h2>
                  Built for modern capital.
                  <br />
                  Not legacy systems
                </h2>
                <p>
                  Connect exchanges, custodians, on-chain wallets, and data
                  providers all synchronized in one unified system for real-time
                  visibility and control.
                </p>
              </div>

              <div className={styles["compare-table"]}>
                <div
                  className={cn(
                    styles["compare-row"],
                    styles["compare-head"],
                  )}
                >
                  <span>Core capabilities</span>
                  <span>synex</span>
                  <span>Other platform</span>
                </div>
                <div className={styles["compare-row"]}>
                  <span>Multi-asset portfolio</span>
                  <span>&#10003;</span>
                  <span>Absent</span>
                </div>
                <div className={styles["compare-row"]}>
                  <span>Real-time data &amp; synchronization</span>
                  <span>&#10003;</span>
                  <span>&#10003;</span>
                </div>
                <div className={styles["compare-row"]}>
                  <span>AI-driven insights &amp; optimization</span>
                  <span>&#10003;</span>
                  <span>Absent</span>
                </div>
                <div className={styles["compare-row"]}>
                  <span>Unified dashboard across all systems</span>
                  <span>&#10003;</span>
                  <span>&#10003;</span>
                </div>
                <div className={styles["compare-row"]}>
                  <span>Opportunity mapping and risk alerts</span>
                  <span>&#10003;</span>
                  <span>Absent</span>
                </div>
                <div
                  className={cn(
                    styles["compare-row"],
                    styles["compare-foot"],
                  )}
                >
                  <span>Total operational cost</span>
                  <span>$469 / month</span>
                  <span>$1,700 / month</span>
                </div>
              </div>

              <div
                className={cn(
                  styles["compare-rock"],
                  styles["compare-rock-left"],
                )}
              >
                <div className={cn(styles.moss, styles["moss-bright"])} />
              </div>

              <div
                className={cn(
                  styles["compare-rock"],
                  styles["compare-rock-right"],
                )}
              >
                <div className={cn(styles.moss, styles["moss-soft"])} />
              </div>
            </div>
          </BrowserFrame>
        </section>
      </main>
    </div>
  );
}

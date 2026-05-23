function ChoosePlan() {
  return (
      <div className="page page--sales">
        <h1>Choose Your Plan</h1>

        <p
          style={{
            marginTop: "12px",
            marginBottom: "40px",
          }}
        >
          Unlock premium summaries and
          audiobook access.
        </p>

        <div
          style={{
            display: "flex",
            gap: "24px",
            flexWrap: "wrap",
          }}
        >
          {/* BASIC */}

          <div
            style={{
              border: "1px solid #ccc",
              padding: "24px",
              borderRadius: "12px",
              width: "300px",
            }}
          >
            <h2>Basic</h2>

            <h1>$0</h1>

            <p>
              Access free summaries only.
            </p>

            <button
              style={{
                marginTop: "20px",
              }}
            >
              Current Plan
            </button>
          </div>

          {/* PREMIUM MONTHLY */}

          <div
            style={{
              border: "2px solid gold",
              padding: "24px",
              borderRadius: "12px",
              width: "300px",
            }}
          >
            <h2>Premium</h2>

            <h1>$9.99/month</h1>

            <p>
              Unlimited premium summaries
              and audio.
            </p>

            <button
              style={{
                marginTop: "20px",
              }}
              onClick={() =>
                window.open(
                  "https://buy.stripe.com/test_9B628s1xQd3W8611tweIw01",
                  "_blank"
                )
              }
            >
              Upgrade
            </button>
          </div>

          {/* PREMIUM YEARLY */}

          <div
            style={{
              border: "2px solid cyan",
              padding: "24px",
              borderRadius: "12px",
              width: "300px",
            }}
          >
            <h2>Premium Plus</h2>

            <h1>$99/year</h1>

            <p>
              Premium access with yearly
              savings and free trial.
            </p>

            <button
              style={{
                marginTop: "20px",
              }}
              onClick={() =>
                window.open(
                  "https://buy.stripe.com/test_eVq28s1xQd3W9a5fkmeIw00",
                  "_blank"
                )
              }
            >
              Start Free Trial
            </button>
          </div>
        </div>
      </div>
  );
}

export default ChoosePlan;

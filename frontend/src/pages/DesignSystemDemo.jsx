import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { colors, spacing } from '../styles/colors';
import { fadeIn, staggerChildren } from '../utils/animations';

export default function DesignSystemDemo() {
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.bg,
      padding: spacing.lg
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <motion.div {...fadeIn} style={{ marginBottom: spacing['2xl'] }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 700,
            color: colors.text,
            marginBottom: spacing.sm,
            fontFamily: 'Inter, sans-serif'
          }}>
            LinkedInScholar Design System
          </h1>
          <p style={{
            fontSize: '18px',
            color: colors.textSecondary,
            lineHeight: '28px'
          }}>
            Ultra-minimalistic design inspired by Linear, Stripe, and Vercel
          </p>
        </motion.div>

        {/* Colors Section */}
        <motion.div
          variants={staggerChildren}
          initial="initial"
          animate="animate"
          style={{ marginBottom: spacing['3xl'] }}
        >
          <h2 style={{
            fontSize: '24px',
            fontWeight: 600,
            color: colors.text,
            marginBottom: spacing.lg,
            fontFamily: 'Inter, sans-serif'
          }}>
            Color Palette
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: spacing.md
          }}>
            {[
              { name: 'Background', color: colors.bg, text: colors.text },
              { name: 'Elevated', color: colors.bgElevated, text: colors.text },
              { name: 'Purple', color: colors.purple, text: colors.text },
              { name: 'Text Secondary', color: colors.textSecondary, text: colors.bg },
              { name: 'Border', color: colors.border, text: colors.text },
              { name: 'Success', color: colors.success, text: colors.text }
            ].map((item) => (
              <motion.div
                key={item.name}
                variants={fadeIn}
                style={{
                  background: item.color,
                  padding: spacing.lg,
                  borderRadius: '8px',
                  border: `1px solid ${colors.border}`,
                  textAlign: 'center'
                }}
              >
                <p style={{
                  color: item.text,
                  fontSize: '14px',
                  fontWeight: 500
                }}>
                  {item.name}
                </p>
                <p style={{
                  color: item.text,
                  fontSize: '12px',
                  marginTop: spacing.xs,
                  opacity: 0.8,
                  fontFamily: 'monospace'
                }}>
                  {item.color}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Buttons Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ marginBottom: spacing['3xl'] }}
        >
          <h2 style={{
            fontSize: '24px',
            fontWeight: 600,
            color: colors.text,
            marginBottom: spacing.lg,
            fontFamily: 'Inter, sans-serif'
          }}>
            Button Variants
          </h2>
          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: spacing.md,
            marginBottom: spacing.lg
          }}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="primary" loading={loading} onClick={handleLoadingDemo}>
              {loading ? 'Loading...' : 'Loading Demo'}
            </Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: spacing.md,
            alignItems: 'center'
          }}>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </motion.div>

        {/* Cards Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ marginBottom: spacing['3xl'] }}
        >
          <h2 style={{
            fontSize: '24px',
            fontWeight: 600,
            color: colors.text,
            marginBottom: spacing.lg,
            fontFamily: 'Inter, sans-serif'
          }}>
            Card Components
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: spacing.lg
          }}>
            <Card>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 600,
                color: colors.text,
                marginBottom: spacing.sm,
                fontFamily: 'Inter, sans-serif'
              }}>
                Basic Card
              </h3>
              <p style={{
                fontSize: '14px',
                color: colors.textSecondary,
                lineHeight: '20px'
              }}>
                This is a basic card with default styling and no hover effects.
              </p>
            </Card>

            <Card hover>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 600,
                color: colors.text,
                marginBottom: spacing.sm,
                fontFamily: 'Inter, sans-serif'
              }}>
                Hover Card
              </h3>
              <p style={{
                fontSize: '14px',
                color: colors.textSecondary,
                lineHeight: '20px'
              }}>
                This card has hover effects enabled. Try hovering over it!
              </p>
            </Card>

            <Card hover onClick={() => alert('Card clicked!')}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 600,
                color: colors.text,
                marginBottom: spacing.sm,
                fontFamily: 'Inter, sans-serif'
              }}>
                Clickable Card
              </h3>
              <p style={{
                fontSize: '14px',
                color: colors.textSecondary,
                lineHeight: '20px',
                marginBottom: spacing.md
              }}>
                This card is clickable and shows cursor pointer on hover.
              </p>
              <Button variant="secondary" size="sm" fullWidth>
                Click me!
              </Button>
            </Card>
          </div>
        </motion.div>

        {/* Inputs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ marginBottom: spacing['3xl'] }}
        >
          <h2 style={{
            fontSize: '24px',
            fontWeight: 600,
            color: colors.text,
            marginBottom: spacing.lg,
            fontFamily: 'Inter, sans-serif'
          }}>
            Form Inputs
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: spacing.lg
          }}>
            <Input
              label="Basic Input"
              placeholder="Enter some text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            
            <Input
              label="Required Input"
              placeholder="This field is required"
              required
            />
            
            <Input
              label="Input with Error"
              placeholder="This has an error"
              error="This field is required"
            />
            
            <Input
              label="Disabled Input"
              placeholder="This is disabled"
              disabled
            />
          </div>
        </motion.div>

        {/* Typography Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 style={{
            fontSize: '24px',
            fontWeight: 600,
            color: colors.text,
            marginBottom: spacing.lg,
            fontFamily: 'Inter, sans-serif'
          }}>
            Typography Scale
          </h2>
          
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
              <h1 style={{ fontSize: '36px', fontWeight: 700, color: colors.text, margin: 0 }}>
                Heading 1 (36px/700)
              </h1>
              <h2 style={{ fontSize: '30px', fontWeight: 600, color: colors.text, margin: 0 }}>
                Heading 2 (30px/600)
              </h2>
              <h3 style={{ fontSize: '24px', fontWeight: 600, color: colors.text, margin: 0 }}>
                Heading 3 (24px/600)
              </h3>
              <h4 style={{ fontSize: '20px', fontWeight: 600, color: colors.text, margin: 0 }}>
                Heading 4 (20px/600)
              </h4>
              <p style={{ fontSize: '16px', fontWeight: 400, color: colors.text, margin: 0 }}>
                Body text (16px/400) - The quick brown fox jumps over the lazy dog.
              </p>
              <p style={{ fontSize: '14px', fontWeight: 400, color: colors.textSecondary, margin: 0 }}>
                Secondary text (14px/400) - Used for descriptions and less important content.
              </p>
              <p style={{ fontSize: '13px', fontWeight: 400, color: colors.textTertiary, margin: 0 }}>
                Tertiary text (13px/400) - Used for captions and metadata.
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
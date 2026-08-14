import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { toast } from '../ui/toast';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required contact fields');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success('Thank you! Your message has been sent to our admissions team.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  return (
    <section id="contact" className="py-24 bg-slate-950 dark:bg-slate-950 light:bg-white border-t border-slate-900 dark:border-slate-900 light:border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <Badge variant="success">GET IN TOUCH</Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-100 dark:text-white light:text-slate-900 tracking-tight">
            Schedule a Demo or Contact Support
          </h2>
          <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-sm sm:text-base">
            Our educational technology specialists are available to guide your institution's digital transformation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Details Column */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-slate-100 dark:text-white light:text-slate-900 mb-6">
                Institution Headquarters
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200 dark:text-slate-200 light:text-slate-800">
                      Campus Address
                    </h4>
                    <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mt-0.5">
                      ScholarHub Education Tower, 750 Academic Parkway, Tech District, CA 94107
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200 dark:text-slate-200 light:text-slate-800">
                      Telephone Helpline
                    </h4>
                    <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mt-0.5">
                      +1 (800) 555-EDUPRO / +1 (415) 890-2341
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200 dark:text-slate-200 light:text-slate-800">
                      Email Contact
                    </h4>
                    <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mt-0.5">
                      support@edumanagepro.com / admissions@edumanagepro.com
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Status Pill */}
            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between text-xs text-indigo-300">
              <span className="font-semibold">⚡ Average Response Time: Under 2 Hours</span>
              <Badge variant="success">ONLINE</Badge>
            </div>
          </div>

          {/* Contact Form Column */}
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name *"
                placeholder="Dr. John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                label="Email Address *"
                type="email"
                placeholder="john.doe@school.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Input
                label="Subject"
                placeholder="Request for School Partnership Demo"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Message *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us about your institution size and specific needs..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full text-sm rounded-xl p-3.5 bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-800 light:bg-white light:border-slate-300 light:text-slate-900"
                />
              </div>

              <Button type="submit" variant="primary" className="w-full" loading={submitting}>
                Submit Inquiry <Send className="w-4 h-4 ml-1" />
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};

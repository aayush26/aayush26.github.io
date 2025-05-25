class Portfolio {
    constructor() {
        this.currentTab = 'about';
        this.cache = {};
        this.blogPosts = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadBlogIndex();
        this.loadTab('about');
    }

    bindEvents() {
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tab = e.target.getAttribute('data-tab');
                this.switchTab(tab);
            });
        });

        // Handle blog post clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('blog-read-more')) {
                e.preventDefault();
                const slug = e.target.getAttribute('data-slug');
                this.loadBlogPost(slug);
            }
            
            if (e.target.classList.contains('back-to-blog')) {
                e.preventDefault();
                this.loadTab('blog');
            }
        });
    }

    async loadBlogIndex() {
        try {
            const response = await fetch('blog/index.json');
            if (response.ok) {
                this.blogPosts = await response.json();
            }
        } catch (error) {
            console.log('Blog index not found, using default posts');
            // Fallback to default blog posts
            this.blogPosts = [
                {
                    slug: "modern-web-development",
                    title: "Modern Web Development Best Practices",
                    date: "2025-05-20",
                    readTime: "8 min read",
                    description: "An exploration of current best practices in web development, covering performance optimization, accessibility, and modern JavaScript frameworks."
                },
                {
                    slug: "minimal-design",
                    title: "The Art of Minimal Design",
                    date: "2025-05-15",
                    readTime: "5 min read",
                    description: "Why less is more in web design and how to create beautiful, functional interfaces with minimal elements."
                },
                {
                    slug: "react-hooks-guide",
                    title: "Understanding React Hooks",
                    date: "2025-05-10",
                    readTime: "12 min read",
                    description: "A comprehensive guide to React Hooks, from basic useState to custom hooks, with practical examples and best practices."
                }
            ];
        }
    }

    async switchTab(tabName) {
        if (tabName === this.currentTab) return;

        // Update active button
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Load content
        await this.loadTab(tabName);
        this.currentTab = tabName;
    }

    async loadTab(tabName) {
        const contentArea = document.getElementById('content-area');
        
        try {
            // Special handling for blog tab
            if (tabName === 'blog') {
                await this.loadBlogList();
                return;
            }

            // Check cache first
            if (this.cache[tabName]) {
                contentArea.innerHTML = this.cache[tabName];
                contentArea.classList.add('fade-in');
                return;
            }

            // Show loading state
            contentArea.innerHTML = '<div class="loading">Loading...</div>';

            // Fetch content
            const response = await fetch(`content/${tabName}.html`);
            if (!response.ok) throw new Error('Content not found');
            
            const content = await response.text();
            
            // Cache the content
            this.cache[tabName] = content;
            
            // Display content with animation
            contentArea.innerHTML = content;
            contentArea.classList.add('fade-in');
            
            // Remove animation class after animation completes
            setTimeout(() => {
                contentArea.classList.remove('fade-in');
            }, 300);

        } catch (error) {
            console.error('Error loading content:', error);
            contentArea.innerHTML = `
                <div class="error">
                    <p>Sorry, content could not be loaded.</p>
                    <p>Please try again later.</p>
                </div>
            `;
        }
    }

    async loadBlogList() {
        const contentArea = document.getElementById('content-area');
        
        let blogListHTML = '<div class="blog-list">';
        
        this.blogPosts.forEach(post => {
            blogListHTML += `
                <article class="blog-item">
                    <h3 class="blog-title">${post.title}</h3>
                    <div class="blog-meta">Posted on ${this.formatDate(post.date)} • ${post.readTime}</div>
                    <p class="blog-description">${post.description}</p>
                    <a href="#" class="blog-read-more" data-slug="${post.slug}">Read more →</a>
                </article>
            `;
        });
        
        blogListHTML += '</div>';
        
        contentArea.innerHTML = blogListHTML;
        contentArea.classList.add('fade-in');
        
        setTimeout(() => {
            contentArea.classList.remove('fade-in');
        }, 300);
    }

    async loadBlogPost(slug) {
        const contentArea = document.getElementById('content-area');
        
        try {
            contentArea.innerHTML = '<div class="loading">Loading blog post...</div>';
            
            const response = await fetch(`blog/${slug}.html`);
            if (!response.ok) throw new Error('Blog post not found');
            
            const content = await response.text();
            
            contentArea.innerHTML = `
                <div class="blog-post">
                    <div class="blog-post-nav">
                        <a href="#" class="back-to-blog">← Back to Blog</a>
                    </div>
                    ${content}
                </div>
            `;
            contentArea.classList.add('fade-in');
            
            setTimeout(() => {
                contentArea.classList.remove('fade-in');
            }, 300);
            
        } catch (error) {
            console.error('Error loading blog post:', error);
            contentArea.innerHTML = `
                <div class="error">
                    <div class="blog-post-nav">
                        <a href="#" class="back-to-blog">← Back to Blog</a>
                    </div>
                    <p>Sorry, this blog post could not be loaded.</p>
                </div>
            `;
        }
    }

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }
}

// Initialize the portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Portfolio();
});

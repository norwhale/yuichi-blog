import Link from "next/link";
import Image from "next/image";

type BlogCardProps = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  readingTime: string;
  image?: string;
};

export default function BlogCard({ slug, title, description, date, tags, readingTime, image }: BlogCardProps) {
  return (
    <article className="group relative flex flex-col cursor-pointer glass-card-v2 rounded-2xl overflow-hidden">
      {/* Image — fixed aspect ratio */}
      <Link href={`/blog/${slug}`} className="block flex-shrink-0">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-background/40">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl opacity-20">📄</span>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-col flex-grow p-5 gap-3">
        {/* Meta */}
        <div className="flex items-center gap-3 font-mono text-xs text-muted">
          <time dateTime={date}>
            {new Date(date).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }).toUpperCase()}
          </time>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>{readingTime}</span>
        </div>

        {/* Title — max 3 lines */}
        <Link href={`/blog/${slug}`}>
          <h2 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors leading-snug line-clamp-3">
            {title}
          </h2>
        </Link>

        {/* Description — max 2 lines */}
        <p className="text-sm text-muted line-clamp-2">
          {description}
        </p>

        {/* Tags */}
        <div className="flex gap-2 flex-wrap pt-1">
          {tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[10px] px-2 py-1 rounded-full bg-accent-light border border-accent/20 font-mono font-medium text-foreground uppercase tracking-wide">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

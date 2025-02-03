import os
import shutil
from pathlib import Path


def flatten_directory(source_dir: str, target_dir: str) -> None:
    """
    Recursively flatten a directory structure, creating new filenames that incorporate
    the original path structure.

    Args:
        source_dir (str): The source directory to flatten (relative to current directory)
        target_dir (str): The target directory where flattened files will be placed
    """
    # Get current working directory
    cwd = Path.cwd()

    # Convert to absolute paths, relative to current directory
    source_path = (cwd / source_dir).resolve()
    target_path = (cwd / target_dir).resolve()

    # Verify source directory exists
    if not source_path.exists():
        raise ValueError(f"Source directory '{source_dir}' does not exist in {cwd}")

    # Create target directory if it doesn't exist
    target_path.mkdir(parents=True, exist_ok=True)

    # Get the source directory name to remove from the flattened path
    source_name = source_path.name

    # Walk through the directory tree
    for root, _, files in os.walk(source_path):
        # Convert current path to Path object
        current_path = Path(root)

        # Get relative path parts after the source directory
        rel_path = current_path.relative_to(source_path.parent)
        path_parts = list(rel_path.parts)

        # Process each file in the current directory
        for file in files:
            # Create new filename incorporating the path
            new_name = "-".join(path_parts + [file])

            # Source and target file paths
            source_file = current_path / file
            target_file = target_path / new_name

            # Copy the file
            shutil.copy2(source_file, target_file)
            print(f"Copied: {source_file} -> {target_file}")


def main():
    import argparse

    parser = argparse.ArgumentParser(
        description="Flatten a directory structure while preserving path information in filenames."
    )
    parser.add_argument(
        "source_dir", help="Source directory to flatten (relative to current directory)"
    )
    parser.add_argument(
        "--target_dir",
        help="Target directory for flattened files (default: source_dir-plain)",
        default=None,
    )

    args = parser.parse_args()

    # If target directory not specified, create default name based on source
    if args.target_dir is None:
        source_path = Path(args.source_dir)
        args.target_dir = f"{source_path.name}-plain"

    try:
        flatten_directory(args.source_dir, args.target_dir)
        print(f"\nDirectory flattening complete!")
        print(f"Source: {args.source_dir}")
        print(f"Target: {args.target_dir}")
    except ValueError as e:
        print(f"Error: {e}")
        exit(1)


if __name__ == "__main__":
    main()
